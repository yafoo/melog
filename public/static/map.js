VueBMap.initBMapApiLoader({
    ak: map_ak,
});

const creat_app = data => {
    const {createApp, onMounted, ref, computed} = Vue;
    const app = {
        setup() {
            onMounted(() => {
                console.log('app mounted');
            });
    
            const mapData = data;
    
            const point = value => {
                return value.split(',');
            }
    
            const color = value => {
                if(!value) {
                    return '';
                }
                return value.slice(0, 7);
            }
    
            const opacity = value => {
                if(!value) {
                    return 1;
                }
                value = value.substring(7);
                if(!value) {
                    return 1;
                }
                return parseInt(value, 16) / 255;
            }
    
            const text = value => {
                value = value.split('::');
                return value[1] || value[0];
            }

            const zoom = ref(data.zoom);
            const scale = computed(() => {
                return 2 ** (parseFloat(zoom.value).toFixed(2) - data.zoom);
            });
            const textStyle = computed(() => {
                return data => {
                    const obj = {color: color(data.text_color), opacity: opacity(data.text_color), fontSize: data.text_size + 'px'};
                    if(data.text_scale == 1) {
                        obj.transformOrigin = '0 0';
                        obj.transform = 'scale(' + scale.value + ')';
                    }
                    return obj;
                }
            });

            const zoomEnd = e => {
                zoom.value = e.target.getZoom();
            }
    
            return {
                mapData,
                point,
                color,
                opacity,
                text,
                textStyle,
                zoomEnd
            }
        }
    }
    return createApp(app);
}

Object.keys(map_data).forEach(id => {
    const app = creat_app(map_data[id]);
    app.config.compilerOptions.delimiters = ['{$', '}'];
    app.use(VueBMap);
    app.mount('.map-' + id);
});