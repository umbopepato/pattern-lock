import { html, css, LitElement, property, svg, internalProperty, query, queryAll } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { CursorPosition, IterableNodeListOf } from './types';
import { arrSequence, distance, limitInRange, resolveDotCenter } from './util';

const dots = arrSequence(8);

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

  private _sequence: number[] = [];
  @internalProperty() private _cursorPosition: CursorPosition | undefined;
  @internalProperty() private _dragging = false;
  @query('svg') private _svgEl: SVGElement | undefined;
  @queryAll('circle') private _dotEls: IterableNodeListOf<SVGCircleElement> | undefined;

  private _onDragStart(num: number, event: Event) {
    window.addEventListener('touchend', this);
    window.addEventListener('touchmove', this);
    this._dragging = true;
    this._sequence.push(num);
    event.preventDefault();
  }

  private _onHoverDot(num: number) {
    if (this._dragging && !this._sequence.includes(num)) {
      this._sequence.push(num);
      window.navigator.vibrate(5);
    }
  }

  private _onDragEnd(num?: number, event?: Event) {
    console.log(this._sequence, event);
    this._dragging = false;
    this._sequence = [];
    this._cursorPosition = undefined;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private _svgCoord(coord: number) {
    return coord * 120 / this._svgEl!.getBoundingClientRect().width;
  }

  handleEvent(event: TouchEvent) {
    switch (event.type) {
      case 'touchend':
        this._onDragEnd();
        window.removeEventListener('touchend', this);
        window.removeEventListener('touchmove', this);
        break;
      case 'touchmove':
        const touch = event.touches[0];
        const padding = 20;
        for (const dot of this._dotEls!) {
          const rect = dot.getBoundingClientRect();
          if (touch.pageX >= rect.left + window.scrollX - padding &&
            touch.pageX <= rect.right + window.scrollX + padding &&
            touch.pageY >= rect.top + window.scrollY - padding &&
            touch.pageY <= rect.bottom + window.scrollY + padding) {
            dot.dispatchEvent(new Event('touchenter'));
            break;
          }
        }
        const parentRect = this._svgEl!.getBoundingClientRect();
        this._cursorPosition = {
          x: this._svgCoord(touch.clientX - parentRect.x),
          y: this._svgCoord(touch.clientY - parentRect.y)
        };
        break;
    }
  }

  private _renderDot(num: number) {
    const { cx, cy } = resolveDotCenter(num);
    return svg`
    <circle r="2.5"
            cx=${cx}
            cy=${cy}
            @touchstart=${(e: Event) => this._onDragStart(num, e)}
            @touchenter=${() => this._onHoverDot(num)}
            @touchend=${(e: Event) => this._onDragEnd(num, e)}
            class=${classMap({touched: this._sequence.includes(num)})}
            style="transform-origin: ${cx}px ${cy}px"/>
    `;
  }

  private _renderLines() {
    return this._sequence.map((num, index, arr) => {
      const { cx, cy } = resolveDotCenter(num),
        last = index === arr.length - 1;
      let nextCoords;
      if (last) {
        nextCoords = {
          cx: this._cursorPosition?.x || cx,
          cy: this._cursorPosition?.y || cy
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
        ${dots.map(d => this._renderDot(d))}
        ${this._dragging ? this._renderLines() : null}
      </svg>
    `;
  }
}
