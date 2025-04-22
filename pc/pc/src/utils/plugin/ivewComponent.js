import Vue from "vue";
import {
  Carousel,
  CarouselItem,
  Panel,
  Spin,
  Poptip,
  Steps,
  Button,
  Icon,
  Input,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  Switch,
  Table,
  Select,
  Option,
  Slider,
  DatePicker,
  TimePicker,
  InputNumber,
  Form,
  FormItem,
  Alert,
  Message,
  Notice,
  Modal,
  Progress,
  Collapse,
  Page,
  Row,
  Col,
  BackTop,
  Scroll,
  Tabs,
  TabPane,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Upload,
  i18n,
} from "iview";
import i18nInstance from "@/lang";
i18n(function(path, options) {
  return i18nInstance.t(path, options);
});
Vue.component("Upload", Upload);
Vue.component("Poptip", Poptip);
Vue.component("Button", Button);
Vue.component("Icon", Icon);
Vue.component("Input", Input);
Vue.component("Radio", Radio);
Vue.component("RadioGroup", RadioGroup);
Vue.component("CheckboxGroup", Checkbox.Group);
Vue.component("Checkbox", Checkbox);
Vue.component("iSwitch", Switch);
Vue.component("Table", Table);
Vue.component("Select", Select);
Vue.component("Option", Option);
Vue.component("Slider", Slider);
Vue.component("DatePicker", DatePicker);
Vue.component("TimePicker", TimePicker);
Vue.component("InputNumber", InputNumber);
Vue.component("Form", Form);
Vue.component("FormItem", Form.Item);
Vue.component("Steps", Steps);
Vue.component("Step", Steps.Step);
Vue.component("Alert", Alert);
Vue.component("Message", Message);
Vue.component("Notice", Notice);
Vue.component("Modal", Modal);
Vue.component("Progress", Progress);
Vue.component("Collapse", Collapse);
Vue.component("Page", Page);
Vue.component("Row", Row);
Vue.component("Col", Col);
Vue.component("Spin", Spin);
Vue.component("Panel", Panel);
Vue.component("Carousel", Carousel);
Vue.component("CarouselItem", CarouselItem);
Vue.component("BackTop", BackTop);
Vue.component("Scroll", Scroll);
Vue.component("Tabs", Tabs);
Vue.component("TabPane", TabPane);
Vue.component("Dropdown", Dropdown);
Vue.component("DropdownMenu", DropdownMenu);
Vue.component("DropdownItem", DropdownItem);
Vue.prototype.$Modal = Modal;
Vue.prototype.$Message = Message;
Vue.prototype.$Notice = Notice;
