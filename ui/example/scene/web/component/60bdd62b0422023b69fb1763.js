!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).C4f255fadb4607=t()}(this,(function(){"use strict";var e;return e=window.Vue,void((()=>{if(!window.conch)return console.info("请先加载comp包"),!0})()||(window.conch.createCss(".Cb42b2f9fa832b *{outline:none;box-sizing:border-box}.Cb42b2f9fa832b p,.Cb42b2f9fa832b dl,.Cb42b2f9fa832b ol,.Cb42b2f9fa832b ul{margin:0;padding:0}.Cb42b2f9fa832b li{list-style:none}.Cb42b2f9fa832b .container{clear:both;position:relative;overflow:hidden}.Cb42b2f9fa832b .list{height:320px;overflow:hidden}.Cb42b2f9fa832b .item-img{width:200px;height:40px;margin:5px 0;object-fit:contain}","C35dc6338fb7d2"),window.conch.register("C60bdd62b0422023b69fb1763",function(){const e=class extends window.conch.Base{constructor(e,t){super(e,t),this.opts={},this.appendTimer=null,this.timer=null,this.rowheight=50,this.data=[{url:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhaoxuexiao888.lingw.net%2Fuploadfile%2Fimage%2F0%2F15%2F455%2F2019-08%2F15668104232372.jpg&refer=http%3A%2F%2Fhaoxuexiao888.lingw.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1624586268&t=270a64f1f39631ee0fb419394d929a86"},{url:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhaoxuexiao888.lingw.net%2Fuploadfile%2Fimage%2F0%2F15%2F455%2F2019-08%2F15668104232372.jpg&refer=http%3A%2F%2Fhaoxuexiao888.lingw.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1624586268&t=270a64f1f39631ee0fb419394d929a86"},{url:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhaoxuexiao888.lingw.net%2Fuploadfile%2Fimage%2F0%2F15%2F455%2F2019-08%2F15668104232372.jpg&refer=http%3A%2F%2Fhaoxuexiao888.lingw.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1624586268&t=270a64f1f39631ee0fb419394d929a86"},{url:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhaoxuexiao888.lingw.net%2Fuploadfile%2Fimage%2F0%2F15%2F455%2F2019-08%2F15668104232372.jpg&refer=http%3A%2F%2Fhaoxuexiao888.lingw.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1624586268&t=270a64f1f39631ee0fb419394d929a86"},{url:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhaoxuexiao888.lingw.net%2Fuploadfile%2Fimage%2F0%2F15%2F455%2F2019-08%2F15668104232372.jpg&refer=http%3A%2F%2Fhaoxuexiao888.lingw.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1624586268&t=270a64f1f39631ee0fb419394d929a86"},{url:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhaoxuexiao888.lingw.net%2Fuploadfile%2Fimage%2F0%2F15%2F455%2F2019-08%2F15668104232372.jpg&refer=http%3A%2F%2Fhaoxuexiao888.lingw.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1624586268&t=270a64f1f39631ee0fb419394d929a86"},{url:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhaoxuexiao888.lingw.net%2Fuploadfile%2Fimage%2F0%2F15%2F455%2F2019-08%2F15668104232372.jpg&refer=http%3A%2F%2Fhaoxuexiao888.lingw.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1624586268&t=270a64f1f39631ee0fb419394d929a86"},{url:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhaoxuexiao888.lingw.net%2Fuploadfile%2Fimage%2F0%2F15%2F455%2F2019-08%2F15668104232372.jpg&refer=http%3A%2F%2Fhaoxuexiao888.lingw.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1624586268&t=270a64f1f39631ee0fb419394d929a86"},{url:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fhaoxuexiao888.lingw.net%2Fuploadfile%2Fimage%2F0%2F15%2F455%2F2019-08%2F15668104232372.jpg&refer=http%3A%2F%2Fhaoxuexiao888.lingw.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1624586268&t=270a64f1f39631ee0fb419394d929a86"}]}render(e,t,i){return e("div",{class:"container"},[e("div",{class:"list"},[t.map(((t,i)=>e("div",{class:"row"},[e("img",{attrs:{src:t.url},class:"item-img"})])))])])}scroll(){let e=0,t=this.dom.querySelectorAll(".row");const i=t.length;t.forEach((e=>{let t=340*Math.random();e.style.marginLeft=t+"px",e.style.transform="",e.style.opacity=1})),clearInterval(this.timer),i<=6||(this.timer=setInterval((async()=>{e%=i,await this.appendBound(t,e),t[e].style.opacity=0,t[e].style.transform=`translateY(${(i-e-1)*this.rowheight}px`,e++}),3e3))}async appendBound(e,t){return clearTimeout(this.appendTimer),new Promise((t=>{this.appendTimer=setTimeout((()=>{e.forEach(((e,t)=>{let i=e.style.transform.match(/-*\d/g);i=i&&i.join("")-0||0,e.style.opacity=1,e.style.transform=`translateY(${i-2*this.rowheight}px)`,e.style.transition="transform 3s linear"})),t()}),1e3)}))}mounted(){clearInterval(this.timer),clearTimeout(this.appendTimer),this.scroll()}setData(e){e&&e.length&&(this.data=e,this.render(),this.instance.$nextTick((()=>{clearInterval(this.timer),clearTimeout(this.appendTimer),this.scroll()})))}setOption(e){e&&(this.opts=Object.assign(this.opts,e),this.render())}};return e.prototype._registerImg=function(e){},e}(),{key:"Cb42b2f9fa832b",width:"540",height:"320",fonts:{young:{file:"young.TTF",psName:"BigYoungMediumGB2.0"}}},e)))}));
