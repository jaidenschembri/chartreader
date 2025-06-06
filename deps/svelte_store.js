import {
  createSubscriber
} from "./chunk-ZPFLGJXZ.js";
import {
  derived,
  get,
  readable,
  readonly,
  writable
} from "./chunk-RKQYHM7D.js";
import "./chunk-IFZ3YZ5Z.js";
import {
  active_effect,
  active_reaction,
  effect_root,
  effect_tracking,
  render_effect,
  set_active_effect,
  set_active_reaction
} from "./chunk-TX64ZVTN.js";
import "./chunk-4BX2QEON.js";
import "./chunk-3RAUGRGE.js";
import "./chunk-UGBVNEQM.js";

// ../node_modules/svelte/src/store/index-client.js
function toStore(get2, set) {
  var effect = active_effect;
  var reaction = active_reaction;
  var init_value = get2();
  const store = writable(init_value, (set2) => {
    var ran = init_value !== get2();
    var teardown;
    var previous_reaction = active_reaction;
    var previous_effect = active_effect;
    set_active_reaction(reaction);
    set_active_effect(effect);
    try {
      teardown = effect_root(() => {
        render_effect(() => {
          const value = get2();
          if (ran) set2(value);
        });
      });
    } finally {
      set_active_reaction(previous_reaction);
      set_active_effect(previous_effect);
    }
    ran = true;
    return teardown;
  });
  if (set) {
    return {
      set,
      update: (fn) => set(fn(get2())),
      subscribe: store.subscribe
    };
  }
  return {
    subscribe: store.subscribe
  };
}
function fromStore(store) {
  let value = (
    /** @type {V} */
    void 0
  );
  const subscribe = createSubscriber((update) => {
    let ran = false;
    const unsubscribe = store.subscribe((v) => {
      value = v;
      if (ran) update();
    });
    ran = true;
    return unsubscribe;
  });
  function current() {
    if (effect_tracking()) {
      subscribe();
      return value;
    }
    return get(store);
  }
  if ("set" in store) {
    return {
      get current() {
        return current();
      },
      set current(v) {
        store.set(v);
      }
    };
  }
  return {
    get current() {
      return current();
    }
  };
}
export {
  derived,
  fromStore,
  get,
  readable,
  readonly,
  toStore,
  writable
};
//# sourceMappingURL=svelte_store.js.map
