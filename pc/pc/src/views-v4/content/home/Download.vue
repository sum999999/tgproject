<template>
	<div class="download">
		<div class="download-top-div"><span class="download-left-span fl">下载中心</span></div>
		<div class="download-bottom-div">
			<div class="cards">
				<div class="download-card">
					<div class="download-card-top">
						<span class="icon ios"></span>
						<span class="appName">iPhone 客户端</span>
					</div>
					<div class="contentWords">iPhone客户端方便好用！若用苹果手机扫一扫这里~随时随地享受投注的乐趣!</div>
					<div class="download-card-bottom">
						<div class="download-card-code">
							<img :src="qrcodes[0] && qrcodes[0].img" alt="" />
							<span class="download-icon"><img src="/static/images/ios.png" alt="" /></span>
						</div>
					</div>
				</div>
				<div class="download-card">
					<div class="download-card-top">
						<span class="icon android"></span>
						<span class="appName">安卓客户端</span>
					</div>
					<div class="contentWords android">
						<p>{{ $configText.main }}安卓客户端！</p>
						<p>扫一扫二维码</p>
						<p>随时随地进行游戏！</p>
					</div>
					<div class="download-card-bottom">
						<div class="download-card-code">
							<img :src="qrcodes[1] && qrcodes[1].img" alt="" />
							<span class="download-icon"><img src="/static/images/android.png" alt="" /></span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import Util from '@/utils/dom.js';
export default {
	computed: {
		qrcodes() {
			return this.$store.state.qrcodes;
		},
		servicer() {
			return this.$store.state.servicer;
		}
	},
	methods: {
		openWin(path) {
			Util.openWin(path);
		}
	}
};
</script>
<style lang="less" scoped>
@sectionTextColor: #676565;
.download {
	width: 100%;
	margin: auto;
	background-color: #f3f7fb;
}
.download-top-div {
	width: 1200px;
	margin: auto;
	height: 24px;
	line-height: 24px;
	font-size: 0;
	margin-bottom: 10px;
	.download-left-span {
		font-size: 24px;
		line-height: 24px;
		font-weight: 500;
		color: @sectionTextColor;
	}
}
.download-bottom-div {
	width: 100%;
	height: 430px;
	min-height: 430px;
	padding-top: 84px;
	margin-top: -42px;
	text-align: center;
	background: url(../../images/download.png) no-repeat center center;
	background-size: cover;
}
.cards {
	width: 1200px;
	min-width: 1200px;
	padding-left: 33px;
	margin: auto;
}
.download-card-top {
	padding-left: 55px;
	height: 34px;
	line-height: 34px;
	font-size: 0;
	text-align: left;
}
.download-card {
	float: left;
	width: 274px;
	height: 314px;
	margin-right: 34px;
	border-radius: 6px;
	padding-top: 18px;
	background-color: rgba(0, 0, 0, 0.38);
}
.contentWords {
	width: 200px;
	color: #bec2bd;
	font-size: 14px;
	margin: auto;
	margin-top: 11px;
	margin-bottom: 18px;
	line-height: 26px;
	text-align: left;
	&.android {
		padding-left: 20px;
	}
}
.appName {
	display: inline-block;
	font-size: 16px;
	vertical-align: top;
	color: #fff;
}
.icon {
	display: inline-block;
	width: 27px;
	height: 34px;
	margin-right: 12px;
	&.ios {
		background: url(../../images/apple.png) no-repeat center center;
		background-size: contain;
	}
	&.android {
		background: url(../../images/Android.png) no-repeat center center;
		background-size: contain;
	}
}
.download-card-code {
	position: relative;
	width: 130px;
	height: 130px;
	border-radius: 20px;
	background-color: #2c73ff;
	margin: auto;
	margin-top: 12px;
	padding: 7px;
	& > .download-icon {
		display: inline-block;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 30px;
		height: 30px;
		margin: auto;
		& > img {
			width: 100%;
		}
	}
}
</style>
