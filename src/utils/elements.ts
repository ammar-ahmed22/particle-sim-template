
export type AttributesProps = {
  [key: string]: string
}

interface EventMap extends GlobalEventHandlersEventMap {};
type EventHandler<K extends keyof EventMap> = (event: EventMap[K]) => void;

type EventHandlerMap = {
  [K in keyof EventMap]?: EventHandler<K>
}

class ElementBuilder<K extends keyof HTMLElementTagNameMap> {
  public element: HTMLElementTagNameMap[K];
  constructor(
    private tagName: K,
    private attributes?: AttributesProps,
    private styles?: Partial<CSSStyleDeclaration>,
    private eventHandlers?: EventHandlerMap
  ) {
    this.element = document.createElement(this.tagName);
    this.applyStyles();
    this.applyAttributes();
    this.applyEventHandlers();
  }

  private applyStyles() {
    Object.assign(this.element.style, this.styles);
  }

  private applyAttributes() {
    if (this.attributes) {
      Object.keys(this.attributes).forEach(key => {
        this.element.setAttribute(key, this.attributes![key])
      }) 
    }
  }

  private applyEventHandlers() {
    if (this.eventHandlers) {
      Object.keys(this.eventHandlers).forEach(e => {
        let event = e as keyof EventMap;
        const handler = this.eventHandlers![event];
        if (handler) {
          this.element.addEventListener(event, handler as EventListener);
        }
      })
    }
  }


  addChild(child: HTMLElement | string): ElementBuilder<K> {
    if (typeof child === "string") {
      this.element.appendChild(document.createTextNode(child));
    } else {
      this.element.appendChild(child);
    }
    return this;
  }

  clearChildren(): ElementBuilder<K> {
    while(this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
    return this;
  }
  

  addStyles(styles: Partial<CSSStyleDeclaration>): ElementBuilder<K> {
    if (this.styles) {
      Object.assign(this.styles, styles);
    } else {
      this.styles = styles;
    }
    this.applyStyles();
    return this;
  }

  addAttributes(attributes: AttributesProps): ElementBuilder<K> {
    if (this.attributes) {
      Object.assign(this.attributes, attributes);
    } else {
      this.attributes = attributes;
    }
    this.applyAttributes();
    return this;
  }

  addEventListeners(handlers: EventHandlerMap): ElementBuilder<K> {
    if (this.eventHandlers) {
      Object.assign(this.eventHandlers, handlers);
    } else {
      this.eventHandlers = handlers;
    }
    this.applyEventHandlers();
    return this;
  }

  render(parent: HTMLElement): ElementBuilder<K> {
    parent.appendChild(this.element);
    return this;
  }
}

export default ElementBuilder;