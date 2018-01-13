// @flow

import { options } from 'preact';

export default function handleRenderErrors() {
  const originalVnode = options.vnode;
  options.vnode = vnode => {
    if (typeof vnode.nodeName === 'function') {
      if (isFunctionalComponent(vnode.nodeName)) {
        vnode.nodeName = wrapFunctionalComponent(vnode.nodeName);
      } else {
        wrapComponent(vnode.nodeName);
      }
    }
    if (originalVnode) originalVnode(vnode);
  };
}

function wrapFunctionalComponent(FnComponent) {
  // only generate safe wrapper once
  if (FnComponent.__safe) return FnComponent.__safe;

  function Wrapper(props, context) {
    try {
      return FnComponent.call(this, props, context);
    } catch (err) {
      console.error(err);
    }
  }
  Wrapper.displayName = FnComponent.displayName;

  return (FnComponent.__safe = Wrapper);
}

function wrapComponent(Component) {
  if (Component.prototype && Component.prototype.render && !Component.__safe) {
    Component.__safe = true; // only wrap components once
    const originalRender = Component.prototype.render;
    Component.prototype.render = function render(...args) {
      try {
        return originalRender.apply(this, args);
      } catch (e) {
        console.error(e);
        return null;
      }
    };
  }
}

export function isFunctionalComponent(Component) {
  return (
    Component &&
    'function' === typeof Component &&
    !(Component.prototype && Component.prototype.render)
  );
}
