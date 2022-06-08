const App = {
    setup() {
        /** ajax请求 **/
        const $ = (url, data) => {
            return new Promise((resolve, reject) => {
                const layer_id = layer.load(0);
                fetch(url, {
                    method: data ? 'post' : 'get',
                    body: data ? JSON.stringify(data) : null,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(rsp => {
                    layer.close(layer_id);
                    rsp.json().then(res => {
                        resolve(res);
                    });
                }).catch(e => {
                    layer.close(layer_id);
                });
            });
        }

        /** 左侧模块列表 **/
        const moduleList = {
            list: {
                module_type: 'list',
                module_name: '文章列表',
                module_icon: 'list'
            },
            banner: {
                module_type: 'banner',
                module_name: '横幅图',
                module_icon: 'picture-fine'
            },
            navbar: {
                module_type: 'navbar',
                module_name: '导航块',
                module_icon: 'table'
            }
        };

        /** 中间模块预览 **/
        const specialItemList = ref([]);
        const currentItemID = ref(-1);
        function getSpecialItemList() {
            $(url_special_item_list + "?special_id=" + special_id).then(res => {
                specialItemList.value = res.data;
                currentItemID.value = -1;
                formData.value = {};
                setTimeout(() => {
                    getElementTop();
                }, 1000);
            });
        }
        function specialItemClick(item) {
            // 为for循环加key
            if(item.type == 'swiper' && typeof item.key == 'undefined') {
                item.key = 0;
                item.data.forEach(it => {
                    item.key++;
                    it.key = item.key;
                });
            }
            if(item.type == 'navbar' && typeof item.key == 'undefined') {
                item.key = 0;
                item.data.list.forEach(it => {
                    item.key++;
                    it.key = item.key;
                });
            }

            currentItemID.value = item.id;
            formData.value = {};
            nextTick(() => {
                formData.value = item; //JSON.parse(JSON.stringify(item));
            });
        }

        onMounted(() => {
            getSpecialItemList();
            place.scrollOffset = document.getElementById('special-list').offsetTop;
        });

        /** 右侧模块编辑 **/
        const formData = ref({});
        function buttonSave() {
            const form_data = {...formData.value.data};
            form_data.id = formData.value.id;
            form_data.type = formData.value.type;
            form_data.enable = formData.value.enable;
            if(~['list'].indexOf(form_data.type)) {
                delete(form_data.list);
            }
            // console.log(form_data);
            specialItemSave(form_data);
        }
        function buttonDel() {
            const id = layer.confirm('确定删除此模块？', {icon: 3, title:'提示', yes() {
                layer.close(id);
                specialItemDel();
            }});
        }

        /** 模块操作接口 **/
        function specialItemAdd(data) {
            $(url_special_item_add, data).then(res => {
                !res.state && layer.msg(res.msg, {time: 1800, icon: 2});
                res.state && layer.msg(res.msg, {time: 1800, icon: 1}, getSpecialItemList);
            });
        }
        function specialItemSave(data) {
            $(url_special_item_save, data).then(res => {
                !res.state && layer.msg(res.msg, {time: 1800, icon: 2});
                res.state && layer.msg(res.msg, {time: 1800, icon: 1}, getSpecialItemList);
            });
        }
        function specialItemDel() {
            const form_data = {
                id: formData.value.id
            };
            $(url_special_item_del, form_data).then(res => {
                !res.state && layer.msg(res.msg, {time: 1800, icon: 2});
                res.state && layer.msg(res.msg, {time: 1800, icon: 1}, getSpecialItemList);
            });
        }
        function specialItemSort(sort_data) {
            const data = {
                special_id: special_id,
                sort: sort_data.join(',')
            };
            $(url_special_item_sort, data).then(res => {
                !res.state && layer.msg(res.msg, {time: 1800, icon: 2});
                res.state && layer.msg(res.msg, {time: 1800, icon: 1}, getSpecialItemList);
            });
        }

        /** 模块拖拽系统 **/
        const place = reactive({
            place: 0,
            topArr: [],
            drapY: 0,
            scrollY: 0,
            scrollOffset: 0,
            placeShow: false
        });
        function dragsort(index) {
            index = parseInt(index);
            // console.log('index:' + index, 'place:' + place.place);
            if(place.place == index || place.place == index + 1) {
                return;
            }
            specialItemList.value.splice(place.place, 0, specialItemList.value[index]);
            specialItemList.value.splice(place.place > index ? index : index + 1, 1);
            const sort_data = [];
            specialItemList.value.forEach((item, key) => {
                if(item.sort != key) {
                    sort_data.push(item.id + ':' + key);
                }
            });
            // console.log(sort_data);
            specialItemSort(sort_data);
        }
        function dragstart(e, module_name) {
            e.dataTransfer.setData('module_name', module_name);
            currentItemID.value = -1;
            place.placeShow = true;
        }
        function dragend() {
            place.placeShow = false;
        }
        function drop(e) {
            const module_name = e.dataTransfer.getData('module_name');
            if(module_name.split('_')[0] == 'sort') {
                dragsort(module_name.split('_')[1]);
                return;
            }
            const data = {};
            data.special_id = special_id;
            data.type = module_name;
            data.sort = place.place;
            specialItemAdd(data);
        }
        function scroll(e) {
            if(e.target.scrollTop == 1 || Math.abs(e.target.scrollTop - place.drapY) < 5) {
                return;
            }
            place.scrollY = e.target.scrollTop;
            place.placeShow && calcPlace();
        }
        function dragover(e) {
            if(e.pageY == 1 || Math.abs(e.pageY + place.scrollY - place.scrollOffset - place.drapY) < 5) {
                return;
            }
            place.drapY = e.pageY + place.scrollY - place.scrollOffset;
            calcPlace();
        }
        function calcPlace() {
            const top_arr = place.topArr;
            const len = top_arr.length - 1;
            const drap_y = place.drapY;
            for(let i=0; i < len; i++) {
                if(drap_y > top_arr[i] && drap_y < top_arr[i + 1]) {
                    if(Math.abs(drap_y - top_arr[i]) <= Math.abs(drap_y - top_arr[i + 1])) {
                        place.place = i;
                    } else {
                        place.place = i + 1;
                    }
                    break;
                }
            }
        }
        function getScrollTop(selector) {
            const dom = document.getElementById(selector);
            return [dom.offsetTop, dom.offsetTop + dom.offsetHeight];
        }
        function getElementTop() {
            const top_arr = [];
            let top_bottom = null;
            specialItemList.value.forEach(item => {
                top_bottom = getScrollTop('special-item-' + item.id);
                top_arr.push(top_bottom[0]);
            });
            top_bottom && top_arr.push(top_bottom[1]);
            place.topArr = top_arr;
            // console.log(top_arr);
        }

        /** 页面数据 **/
        return {
            moduleList,
            specialItemList,
            currentItemID,
            specialItemClick,
            formData,
            buttonSave,
            buttonDel,
            ...toRefs(place),
            dragstart,
            dragend,
            dragover,
            drop,
            scroll
        }
    }
}; 
const app = createApp(App);
app.config.compilerOptions.delimiters = ['{$', '}']
app.use(LayuiVue);
Object.keys(components).forEach(tag => {
    app.component(tag, components[tag]);
});
app.mount('.spedit');