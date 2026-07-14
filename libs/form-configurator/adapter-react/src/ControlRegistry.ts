import { RendererRegistryEntry, UISchema, DataSchema } from 'gd-form-configurator';
import { TextControl } from './controls/TextControl';
import { NumberControl } from './controls/NumberControl';
import { SelectControl } from './controls/SelectControl';
import { DateControl } from './controls/DateControl';
import { PasswordControl } from './controls/PasswordControl';
import { EmailControl } from './controls/EmailControl';
import { UrlControl } from './controls/UrlControl';
import { TelControl } from './controls/TelControl';
import { SearchControl } from './controls/SearchControl';
import { TimeControl } from './controls/TimeControl';
import { ColorControl } from './controls/ColorControl';
import { RangeControl } from './controls/RangeControl';
import { TextareaControl } from './controls/TextareaControl';
import { FileControl } from './controls/FileControl';
import { SwitchControl } from './controls/SwitchControl';
import { ArrayControl } from './controls/ArrayControl';
import { withControlAdapter } from './lib/withControlAdapter';
import { VerticalLayout } from './layouts/VerticalLayout';
import { HorizontalLayout } from './layouts/HorizontalLayout';
import { CategorizationLayoutComponent } from './layouts/CategorizationLayout';
import { GroupLayoutComponent } from './layouts/GroupLayout';
import { NestedLayoutComponent } from './layouts/NestedLayout';
import {
  passwordTester,
  emailTester,
  uriTester,
  dateTester,
  timeTester,
  telTester,
  textareaTester,
  rangeTester,
  fileTester,
  colorTester,
  searchTester,
  arrayTester,
} from './lib/testers';

const textControlTester = (uischema: UISchema, schema: DataSchema): number =>
  schema.type === 'string' && !schema.enum ? 1 : -1;

const numberControlTester = (uischema: UISchema, schema: DataSchema): number => (schema.type === 'number' ? 1 : -1);

const booleanControlTester = (uischema: UISchema, schema: DataSchema): number => (schema.type === 'boolean' ? 1 : -1);

const selectControlTester = (uischema: UISchema, schema: DataSchema): number =>
  schema.type === 'string' && schema.enum ? 2 : -1;

const verticalLayoutTester = (uischema: UISchema): number => (uischema.type === 'VerticalLayout' ? 1 : -1);

const horizontalLayoutTester = (uischema: UISchema): number => (uischema.type === 'HorizontalLayout' ? 1 : -1);

const categorizationLayoutTester = (uischema: UISchema): number => (uischema.type === 'Categorization' ? 1 : -1);

const groupLayoutTester = (uischema: UISchema): number => (uischema.type === 'Group' ? 1 : -1);

const nestedLayoutTester = (uischema: UISchema): number => (uischema.type === 'NestedLayout' ? 1 : -1);

export const defaultControlRegistry: RendererRegistryEntry[] = [
  {
    tester: arrayTester,
    renderer: withControlAdapter(ArrayControl),
  },
  {
    tester: passwordTester,
    renderer: withControlAdapter(PasswordControl),
  },
  {
    tester: emailTester,
    renderer: withControlAdapter(EmailControl),
  },
  {
    tester: uriTester,
    renderer: withControlAdapter(UrlControl),
  },
  {
    tester: dateTester,
    renderer: withControlAdapter(DateControl),
  },
  {
    tester: timeTester,
    renderer: withControlAdapter(TimeControl),
  },
  {
    tester: telTester,
    renderer: withControlAdapter(TelControl),
  },
  {
    tester: searchTester,
    renderer: withControlAdapter(SearchControl),
  },
  {
    tester: colorTester,
    renderer: withControlAdapter(ColorControl),
  },
  {
    tester: fileTester,
    renderer: withControlAdapter(FileControl),
  },
  {
    tester: textareaTester,
    renderer: withControlAdapter(TextareaControl),
  },
  {
    tester: rangeTester,
    renderer: withControlAdapter(RangeControl),
  },
  {
    tester: selectControlTester,
    renderer: withControlAdapter(SelectControl),
  },
  {
    tester: textControlTester,
    renderer: withControlAdapter(TextControl),
  },
  {
    tester: numberControlTester,
    renderer: withControlAdapter(NumberControl),
  },
  {
    tester: booleanControlTester,
    renderer: withControlAdapter(SwitchControl),
  },
  {
    tester: verticalLayoutTester,
    renderer: VerticalLayout,
  },
  {
    tester: horizontalLayoutTester,
    renderer: HorizontalLayout,
  },
  {
    tester: categorizationLayoutTester,
    renderer: CategorizationLayoutComponent,
  },
  {
    tester: groupLayoutTester,
    renderer: GroupLayoutComponent,
  },
  {
    tester: nestedLayoutTester,
    renderer: NestedLayoutComponent,
  },
];
