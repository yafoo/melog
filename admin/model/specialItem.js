const {Model} = require('jj.js');

class SpecialItem extends Model
{
    async specialItemList(special_id, enable=0) {
        const condition = {special_id};
        if(enable) {
            condition.enable = 1;
        }
        const item_list = await this.db.order('sort', 'asc').order('id', 'asc').select(condition);

        item_list.forEach(item => {
            if(item.data) {
                item.data = JSON.parse(item.data);
            } else {
                // 方便前端渲染
                item.data = {list: [], enable: 0};
            }
            switch(item.type) {
                case 'list':
                    if(item.data.rows === undefined) {
                        item.data.rows = 5;
                    }
                    break;
            }
        });

        // foreach($item_list as &$item) {
        //     if($item['data']) {
        //         $item['data'] = unserialize($item['data']);
        //     } else {
        //         $item['data'] = [];
        //     }
        //     switch($item['type']) {
        //         case 'banner':
        //             if(!isset($item['data']['img'])) {
        //                 $item['data']['img'] = '';
        //             }
        //             if(!isset($item['data']['url'])) {
        //                 $item['data']['url'] = '';
        //             }
        //             break;
        //         case 'swiper':
        //             if(empty($item['data'])) {
        //                 $item['data'][] = [];
        //             }
        //             break;
        //         case 'navbar':
        //             if(!isset($item['data']['column'])) {
        //                 $item['data']['column'] = 4;
        //             }
        //             if(!isset($item['data']['list'])) {
        //                 $item['data']['list'] = [[]];
        //             }
        //             break;
        //         case 'list':
        //             if(!isset($item['data']['rows'])) {
        //                 $item['data']['rows'] = 5;
        //             }
        //             if(!isset($item['data']['list_type'])) {
        //                 $item['data']['list_type'] = 'huodong';
        //             }
        //             if(!isset($item['data']['posid'])) {
        //                 $item['data']['posid'] = 0;
        //             }
        //             $where = 'a.posid=' . $item['data']['posid'];
        //             $where .= ' and (a.status = 1 or (a.status = 0 and a.createtime <'.time().'))';
        //             $list = db($item['data']['list_type'])
        //                 ->alias("a")
        //                 ->join("category c", " a.catid = c.id", "left")
        //                 ->field('a.id,a.catid,a.title,a.thumb,a.hits,a.createtime,c.catdir')
        //                 ->where($where)
        //                 ->limit($item['data']['rows'])
        //                 ->order('a.id desc')
        //                 ->select();
        //             if($list) {
        //                 foreach($list as $k => $v) {
        //                     $list[$k]['url'] = url('mobile/'.$v['catdir'].'/info', array('catId'=>$v['catid'], 'id'=>$v['id']));
        //                     $list[$k]['thumb_url'] = imgUrl($v['thumb'],'/static/mobile/img/'. $k .'.jpg');
        //                     $list[$k]['creatdate'] = date('Y-m-d', $v['createtime']);
        //                 }
        //                 $item['data']['list'] = $list;
        //             } else {
        //                 $item['data']['list'] = [[]];
        //             }
        //             break;
        //     }
        // }

        return item_list;
    }

    async specialItemSave(data) {
        if(data.data) {
            data.data = JSON.stringify(data.data);
        } else if(!data.id) {
            data.data = '';
        }

        let msg = true;

        if(data.id) {
            const result = await this.save(data);
            if(!result) {
                msg = '修改失败！';
            }
        } else {
            data.add_time = this.$utils.time();

            await this.db.startTrans();
            try {
                const result = await this.save(data);
                if(!result) {
                    throw new Error('新增失败！');
                }

                const sort_data = [];
                if(data.sort) {
                    const item_list = await this.db.where({special_id: data.special_id}).order('sort', 'asc').order('id', 'asc').limit(data.sort, 1000).select();
                    item_list.forEach((item, index) => {
                        sort_data.push({id: item.id, sort: data.sort + index + 1});
                    });

                    msg = await this.specialItemSort(sort_data);
                    if(msg !== true) {
                        throw new Error(msg);
                    }
                }

                await this.db.commit();
            } catch(err) {
                msg = err.msg || '系统出错！';
                await this.db.rollback();
            }

        }

        return msg;
    }

    async specialItemSort(sort_data) {
        let msg = true;
        if(!sort_data || !sort_data.length) {
            return msg;
        }

        await this.db.startTrans();
        try {
            for(let i=0; i<sort_data.length; i++) {
                const result = await this.save(sort_data[i]);
                if(!result) {
                    throw new Error('更新排序失败！');
                }
            }
            await this.db.commit();
        } catch(err) {
            msg = err.msg || '系统出错！';
            await this.db.rollback();
        }

        return msg;
    }

    async specialItemDel(id) {
        let msg = true;
        if(!id) {
            msg = '参数错误！';
            return msg;
        }

        const result = await this.del({id});
        if(!result) {
            msg = '删除失败！';
        }

        return msg;
    }
}

module.exports = SpecialItem;