import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components';
import { AtIcon, AtBadge } from 'taro-ui';
import { connect } from '@tarojs/redux';
import { addToCart } from '../../store/actions/cartActions';
import CartGoodList from '../../components/CartGoodList/index';
import { apiUrl } from '../../utils/api';
import './index.less';

@connect(({ cartReducer }) => ({
  cartReducer
}))
export default class GoodInfo extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      isOpen: false,
      badgeNum: 0,
      fetchData: {
        dataList: []
      },
    };
  }

  config = {
    navigationBarTitleText: '商品详情',
    navigationBarBackgroundColor: '#000',
    navigationBarTextStyle: "#fff",
  };

  componentDidMount() {
    const preload = this.$router.preload;
    this.setState({
      id: preload.id,
      name: preload.name,
      price: preload.price,
    });
    const id = preload.id;
    Taro.request({
      url: `${apiUrl}/mock/5c47cf65f513860f4ceef6a3/example/haiFengMiNi/proDetail`,
      data: { id },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      }
    }).then((res) => {
      this.setState({
        fetchData: res.data.data
      });
    });
  }

  componentDidShow() {
    const { cartReducer } = this.props;

    this.setState({
      badgeNum: cartReducer.badgeNum,
    });
  }

  /**
   * 添加商品
   * @param id
   * @param name
   * @param price
   */
  addGood = (id, name, price) => {
    this.props.dispatch(addToCart(id, name, price));
    const { cartReducer } = this.props;

    this.setState({
      badgeNum: cartReducer.badgeNum,
    });
  };

  /**
   * 打开关闭购物车详情
   */
  buyingInfo() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  /**
   * 跳转商品列表
   */
  goProList = () => {
    Taro.navigateTo({
      url: `/pages/proList/index`
    });
  };
  /**
   * 跳转购物车
   */
  goPay = () => {
    Taro.navigateTo({
      url: `/pages/cart/index`
    });
  };

  /**
   * CartGoodList 子组件回调
   * @param type
   */
  callback(type) {
    if (type === '1') {
      this.setState({ isOpen: false });
    } else if (type === '2') {
      let badgeNum = this.state.badgeNum;
      badgeNum += 1;
      this.setState({
        badgeNum: badgeNum,
      });
    } else if (type === '3') {
      let badgeNum = this.state.badgeNum;
      badgeNum -= 1;
      this.setState({
        badgeNum: badgeNum,
      });
    }
  }

  render() {
    const { fetchData, id, name, price, isOpen, badgeNum } = this.state;
    const { dataList } = fetchData;
    return (
      <View className='goodInfoWrap'>
        <ScrollView
          scroll-y='true'
          scrollWithAnimation
          className='scrollDom'
        >
          <Swiper
            indicatorColor='#999'
            indicatorActiveColor='#333'
            circular
            indicatorDots
            autoplay
          >
            {
              Array.isArray(dataList) && dataList.length > 0 && dataList.map((data) => {
                return (
                  <SwiperItem className='swipImgWrap' key={data.id}>
                    <Image src={data.img} className='swipImg' />
                  </SwiperItem>
                );
              })
            }
          </Swiper>
          <View className='briefWrap'>
            <View className='briefTop'>
              <Text>{fetchData.name}</Text>
              <Text className='briefSalesVolume'>销量：{fetchData.salesVolume}</Text>
            </View>
            <View className='briefMid'>{fetchData.brief}</View>
            <View className='briefBottom'>￥{fetchData.price}</View>
          </View>
          {
            Array.isArray(dataList) && dataList.length > 0 && dataList.map((data) => {
              return (
                <View className='detailWrap' key={data.id}>
                  <View className='detailTitle'>{data.title}</View>
                  <View className='detailTxt'>{data.txt}</View>
                  <View className='detailImgWrap' key={data.id}>
                    <Image src={data.img} className='detailImg' />
                  </View>
                </View>
              );
            })
          }
        </ScrollView>
        <View className='goodInfoBottom'>
          <View className='bottomIconWrap'>
            <View className='bottomIcon'>
              <AtIcon value='home' size='30' color='#fff' />
              <View className='iconTxt'>首页</View>
            </View>
            <View className='bottomIcon' onClick={this.goProList}>
              <AtIcon value='bullet-list' size='30' color='#fff' />
              <View className='iconTxt'>分类</View>
            </View>
            <View className='bottomIcon' onClick={this.buyingInfo}>
              <AtBadge value={badgeNum > 0 ? badgeNum : ''}>
                <AtIcon value='shopping-cart' size='30' color='#fff' />
              </AtBadge>
              <View className='iconTxt'>购物车</View>
            </View>
          </View>
          <View className='addToCart' onClick={this.addGood.bind(this, id, name, price)}>加入购物车</View>
          <View className='goPay' onClick={this.goPay}>去结算</View>
        </View>
        <CartGoodList
          isOpen={isOpen}
          onIsOpen={this.callback}
        />
      </View>
    );
  }
}
