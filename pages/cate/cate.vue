<template>
	<view>
		<!-- 使用自定义的搜索组件 -->
		<my-search @searchClick="gotoSearch"></my-search>
		
		<view class="scroll-view-container">
			<!-- 左侧滑动区域 -->
			<scroll-view class="left-scroll-view" scroll-y="true" :style="{height: wh +'px'}">
				<block v-for="(item, index) in cateList" :key="index">
					<view :class="['left-scroll-view-item', index === active ? 'active' : '']" @click="activeChange(index)">{{item.cat_name}}</view>
				</block>
				
			</scroll-view>
			<!-- 右侧滑动区域 -->
			<scroll-view scroll-y="true" :style="{height: wh +'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
					<!-- 二级分类的标题 -->
					<view class="cate-lv2-title">/ {{item2.cat_name}}</view>
					
					<!-- 当前二级分类下的三级分类列表 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
							<image :src="item3.cat_icon"></image>
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 当前设备可用的高度,目的是在不同设备上都能将可用屏幕的高度沾满，就不用写死
				wh: 0,
				cateList: [],
				active: 0,
				
				// 二级分类
				cateLevel2: [],
				scrollTop: 0
			};
		},
		onLoad() {
			// 一进入页面之后，就调用uni的一个方法拿到当前设备的信息
			const sysInfo = uni.getSystemInfoSync()
			this.wh = sysInfo.windowHeight - 50
			
			this.getCateList()
		},
		methods: {
			// 获取分类列表的数据
			async getCateList() {
				const {data: res} = await uni.$http.get('/api/public/v1/categories')
				if(res.meta.status !== 200) return uni.$shoMsg()
				this.cateList = res.message
				
				// 二级分类赋值
				this.cateLevel2 = res.message[0].children
			},
			activeChange(index) {
				this.active = index
				
				// 重新为二级分类赋值
				this.cateLevel2 = this.cateList[index].children
				
				// 切换导航的时候，滑动区域的滚动条就重置为0
				this.scrollTop = this.scrollTop === 0 ? 1 : 0
			},
			
			// 跳转到商品列表页面
			gotoGoodsList(item) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + item.cat_id
				})
			},
			
			// 点击跳转搜索页面
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
.scroll-view-container{
	display: flex;
	
	.left-scroll-view{
		width: 120px;
	}
}
.left-scroll-view-item{
	background-color: #f7f7f7;
	line-height: 60px;
	text-align: center;
	font-size: 12px;
	
	&.active {
		background-color: #FFFFFF;
		position: relative;
		
		&::before {
			content: '';
			display: block;
			width: 3px;
			height: 30px;
			background-color: #c00000;
			position: absolute;
			top: 50%;
			left: 0;
			transform: translateY(-50%);
			
		}
	}
}

.cate-lv2-title{
		font-size: 12px;
		font-weight: bold;
		text-align: center;
		padding: 15px 0;
	}


.cate-lv3-list {
	display: flex;
	flex-wrap: wrap;
	
	.cate-lv3-item {
		width: 33.33%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-bottom: 10px;
		
		image {
			width: 60px;
			height: 60px;
		}
		
		text {
			font-size: 12px;
		}
	}
}
	
</style>
