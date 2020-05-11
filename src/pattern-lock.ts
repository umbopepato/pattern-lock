import { html, css, LitElement, property, svg, internalProperty, query, queryAll } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';

type IterableNodeListOf<T extends Node> = NodeListOf<T> & Iterable<T>;

interface CursorPosition {
  x: number;
  y: number;
}

const resolveDotCenter = (num: number) => ({
  cx: 20 + num % 3 * 40,
  cy: 20 + Math.floor(num / 3) * 40
});

const distance = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const limitInRange = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const dots = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export class PatternLock extends LitElement implements EventListenerObject {
  static styles = css`
    :host {
      width: 324px;
      display: block;
      touch-action: none;
    }

    svg {
      width: 100%;
    }

    circle {
      fill: #FFF;
      stroke: transparent;
      stroke-width: 15px;
    }
    
    circle.touched {
      animation: pop .05s ease alternate;
      animation-iteration-count: 2;
    }
    
    @keyframes pop {
      to {
        transform: scale(2);
      }
    }

    line {
      stroke: #FFF;
      stroke-width: 1.4px;
    }

    line.fade {
      animation: fade .5s ease forwards;
    }

    @keyframes fade {
      to {
        opacity: 0;
      }
    }
  `;

  private sequence: number[] = [];

  @property() cursorPosition: CursorPosition | undefined;
  @property() dragging = false;
  @query('svg') svgEl: SVGElement | undefined;
  @queryAll('circle') dots: IterableNodeListOf<SVGCircleElement> | undefined;

  onDragStart(num: number, event: Event) {
    window.addEventListener('touchend', this);
    window.addEventListener('touchmove', this);
    this.dragging = true;
    this.sequence.push(num);
    event.preventDefault();
  }

  onHoverDot(num: number) {
    if (this.dragging && !this.sequence.includes(num)) {
      this.sequence.push(num);
      window.navigator.vibrate(5);
    }
  }

  onDragEnd(num?: number, event?: Event) {
    console.log(this.sequence, event);
    this.dragging = false;
    this.sequence = [];
    this.cursorPosition = undefined;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  svgCoord(coord: number) {
    return coord * 120 / this.svgEl!.getBoundingClientRect().width;
  }

  handleEvent(event: TouchEvent) {
    switch (event.type) {
      case 'touchend':
        this.onDragEnd();
        window.removeEventListener('touchend', this);
        window.removeEventListener('touchmove', this);
        break;
      case 'touchmove':
        const touch = event.touches[0];
        const padding = 20;
        for (const dot of this.dots!) {
          const rect = dot.getBoundingClientRect();
          if (touch.pageX >= rect.left + window.scrollX - padding &&
            touch.pageX <= rect.right + window.scrollX + padding &&
            touch.pageY >= rect.top + window.scrollY - padding &&
            touch.pageY <= rect.bottom + window.scrollY + padding) {
            dot.dispatchEvent(new Event('touchenter'));
            break;
          }
        }
        const parentRect = this.svgEl!.getBoundingClientRect();
        this.cursorPosition = {
          x: this.svgCoord(touch.clientX - parentRect.x),
          y: this.svgCoord(touch.clientY - parentRect.y)
        };
        break;
    }
  }

  renderDot(num: number) {
    const { cx, cy } = resolveDotCenter(num);
    return svg`
    <circle r="2.5"
            cx=${cx}
            cy=${cy}
            @touchstart=${(e: Event) => this.onDragStart(num, e)}
            @touchenter=${() => this.onHoverDot(num)}
            @touchend=${(e: Event) => this.onDragEnd(num, e)}
            class=${classMap({touched: this.sequence.includes(num)})}
            style="transform-origin: ${cx}px ${cy}px"/>
    `;
  }

  renderLines() {
    return this.sequence.map((num, index, arr) => {
      const { cx, cy } = resolveDotCenter(num),
        last = index === arr.length - 1;
      let nextCoords;
      if (last) {
        nextCoords = {
          cx: this.cursorPosition?.x || cx,
          cy: this.cursorPosition?.y || cy
        };
      } else {
        nextCoords = resolveDotCenter(arr[index + 1]);
      }
      const opacity = last ? limitInRange(distance(cx, cy, nextCoords.cx, nextCoords.cy), 0, 20) / 20 : null;
      return svg`
      <line class=${classMap({fade: !last})}
            style=${opacity ? `opacity: ${opacity}` : ''}
            x1=${cx}
            y1=${cy}
            x2=${nextCoords.cx}
            y2=${nextCoords.cy} />
      `;
    });
  }

  render() {
    return html`
      <svg viewBox="0 0 120 120">
        ${dots.map(d => this.renderDot(d))}
        ${this.dragging ? this.renderLines() : null}
      </svg>
    `;
  }
}
