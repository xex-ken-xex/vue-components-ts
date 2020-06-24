<!--
  ## 要素
  領域：
    Lunatic
    Heartful
    Romantic
    Catastorophe
    Center(無名)
  カウンタ：トータル13個
  ## 振る舞い
    領域はSVGでデザインする
    カウンタは、各領域から別の領域へ移動可能
    移動後に、増減があった領域で、カウンタ数をポップアップする
-->
<template>
  <div id="ode">
    <svg
      :width="width"
      :height="height"
      :viewBox="viewport"
      fill="purple"
      stroke="black"
      class="ode"
    >
      <circle
        id="Lunatic"
        cx="100"
        cy="200"
        r="50"
        fill="purple"
        stroke="black"
        stroke-width="10"
        @moved="moved($event)"
      />
      <circle id="Heartful" cx="200" cy="200" r="50" fill="pink" stroke="black" stroke-width="10" />
      <circle id="Romantic" cx="300" cy="200" r="50" fill="red" stroke="black" stroke-width="10" />
      <circle
        id="Catastorophe"
        cx="400"
        cy="200"
        r="50"
        fill="black"
        stroke="black"
        stroke-width="10"
      />
      <circle id="Center" cx="500" cy="200" r="50" fill="green" stroke="black" stroke-width="10" />
      <rect
        v-for="(r, idx) in rects"
        :key="idx"
        @mousedown="mouseDown($event, idx)"
        :fill="r.color"
        :x="r.x"
        :y="r.y"
        :width="r.w"
        :height="r.h"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import OdeRegion from './region.vue';

@Component({
  components: {
    OdeRegion,
  },
})
export default class Ode extends Vue {
  public width = 500;
  public height = 500;
  public dx = 0;
  public dy = 0;
  public isMove = false;
  public beforeMouseX: number | null = null;
  public beforeMouseY: number | null = null;
  public selectIdx = 0;
  public viewport = '0 0 500 500';
  public rects = [
    {
      x: 10,
      y: 10,
      w: 20,
      h: 20,
      color: 'green',
    },
    {
      x: 200,
      y: 150,
      w: 20,
      h: 20,
      color: 'red',
    },
    {
      x: 310,
      y: 410,
      w: 20,
      h: 20,
      color: 'blue',
    },
  ];

  @Prop() private msg!: string;

  public mounted() {
    console.log('MOUNT LISTENER ON');
    document.addEventListener('mouseup', this.mouseUp);
    document.addEventListener('mousemove', this.mouseMove);
  }

  public beforeDestroy() {
    console.log('MOUNT LISTENER OFF');
    document.removeEventListener('mouseup', this.mouseUp);
    document.removeEventListener('mousemove', this.mouseMove);
  }

  public moved(e: MouseEvent, i: number) {
    console.log(e, i);
  }

  // 図形を動かすフラグを立てる
  public mouseDown(e: MouseEvent, i: number) {
    this.isMove = true;
    // iは、rects配列ドラッグされた要素の0インデックスが入る
    this.selectIdx = i;
    e.preventDefault();
  }

  // それぞれのオーデにいくつカウンタが置かれているかCHECKする
  public checkCounters() {
    // '#Lunatic'
    // '#Catastorophe'
    // '#Romantic'
    // '#Heartful'
    const odes = [
      { name: '#Lunatic', count: 0 },
      { name: '#Catastorophe', count: 0 },
      { name: '#Romantic', count: 0 },
      { name: '#Heartful', count: 0 },
    ];
    this.rects.forEach((rect) => {
      // console.log(rect.x, rect.y, rect.w, rect.h);
      odes.forEach((ode) => {
        const inRect = this.isRectInRect(
          rect.x,
          rect.y,
          rect.w,
          rect.h,
          ode.name,
        );
        if (inRect) {
          console.log('rect in ' + ode.name);
        }
      });
    });
  }
  // それぞれのオーデにいくつカウンタが置かれているかCHECKする系のIF
  public isRectInRect(
    x: number,
    y: number,
    w: number,
    h: number,
    id: string,
  ): boolean {
    const odeElement = document.querySelector(id);
    if (odeElement) {
      // SVGGraphicsElement.getBBox()
      // 似たようなものに、element.getBoundingClientRect();があるが、ビューポートからの相対値を返す
      const bBox = (odeElement as SVGSVGElement).getBBox();
      console.log('----' + id);
      console.log(x, y, w, h);
      console.log(bBox);
      if (
        (bBox.x > x) &&
        (bBox.x + bBox.width < x + w) &&
        (bBox.y > y) &&
        (bBox.y + bBox.height < y + h)
      ) {
        console.log( 'in!!' + id );
        return true;
      }
    } else {
      console.log( 'ng querySelector' + id );
    }
    return false;
  }

  // マウスのクリックが終わった段階で初期化
  public mouseUp(e: MouseEvent) {
    if (this.isMove) {
      this.checkCounters();
    }
    this.isMove = false;
    this.beforeMouseX = null;
    this.beforeMouseY = null;
    e.preventDefault();
  }

  // move中は前回まで動かした差分を取りながら座標を変化させていく
  public mouseMove(e: MouseEvent) {
    if (!this.isMove) { return; }
    const mouseX = e.offsetX + this.dx;
    const mouseY = e.offsetY + this.dy;
    let dx = 0;
    let dy = 0;
    if (this.beforeMouseX && this.beforeMouseY) {
      dx = mouseX - this.beforeMouseX;
      dy = mouseY - this.beforeMouseY;
    }
    this.beforeMouseX = mouseX;
    this.beforeMouseY = mouseY;
    const tempX = dx + Number(this.rects[this.selectIdx].x);
    const tempY = dy + Number(this.rects[this.selectIdx].y);
    if (tempX > 0) { this.rects[this.selectIdx].x = tempX; }
    if (tempY > 0) { this.rects[this.selectIdx].y = tempY; }
    e.preventDefault();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ode {
  background-color: #42b983;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
ul {
  list-style-type: none;
}
li {
  cursor: pointer;
  padding: 10px;
  border: solid #ddd 1px;
}
</style>
