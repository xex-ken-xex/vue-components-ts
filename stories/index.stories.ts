import { storiesOf } from '@storybook/vue';

import HelloWorld from '../src/components/HelloWorld.vue';
import Ode from '../src/components/brownie/ode.vue';


storiesOf('HelloWorld', module)
  .add('simple', () => ({
    components: { HelloWorld },
    template: `<HelloWorld msg="Welcome to Your Vue.js + TypeScript + Storybook App"/>`,
  }));

storiesOf('少女展覧会', module)
  .add('オーデ', () => ({
    components: { Ode },
    template: '<Ode msg="Welcome to Your Vue.js + TypeScript App"/>',
  }));
