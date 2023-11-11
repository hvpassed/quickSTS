import { list } from "@system.contact";

export default{
    data: {
      //规则: "level":{"level+'-id'":[type,前驱],...}
      graph:new Map(),
      levels:0,
      //"level":{key:[top,left,radius]}
      Pos:new Map(),

    },
    generateGaussianNoise(mean, stdDev) {
        // 使用 Box-Muller 转换生成正态分布的随机数
        let u1, u2;
        do {
            u1 = Math.random();
            u2 = Math.random();
        } while (u1 <= Number.EPSILON); // 避免u1为0，因为log(0)是undefined
        
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        // const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2); // 如果需要两个相互独立的正态分布随机数
        
        // 应用均值和标准差进行缩放
        const gaussianNoise = z0 * stdDev + mean;
        
        return gaussianNoise;
    },
    decompose(x,n){
        //x>n
        var res = new Array(n);
        
        var navg = parseInt(x/n);
        res.fill(navg);
        var remainder = parseInt(x%n);
        for(var i =0;i<remainder;i++){
            var index = parseInt(Math.random()*n);
            res[index]+=1;
        }
        return res;
    },
    generatePos(width,height,radius){
        var deltaY = height/this.data.levels;
        
    },
    generateNodes(totalLevel,rNum){
        this.data.levels = totalLevel;
        for(var i = 0;i<totalLevel;i++){
            var mp =new Map();
            var rd = 4,perc = Math.random();
            if(perc<=0.5){
                rd=4;
            }        
            else if(perc>0.5 && perc<0.75){
                rd=3;
            }    
            else{
                rd=5;
            }
            mp['length']=rd;
            for(var j=0;j<rd;j++){
                var type="M";
                var name = i+"-"+j;
                mp[name]=[type,0];
                //console.log(mp)
            }
        
            this.data.graph[i] = mp;
        }

    },
    generatePath(){
        //处理开头和结尾
        var mps=new Map(),mpend=new Map();
        mps['length']=1;
        mpend['length']=1;
        var name = "-1-0";
        mps[name] = ["S",0];
        this.data.graph[-1] = mps;
        name = this.data.levels+"-0";
        mpend[name]=["B",0];
        this.data.graph[this.data.levels] = mpend;
        this.data.levels +=1;
        let prelength = 1;
        //分配前驱
        
        for(var i=0;i<this.data.levels;i++)
        {
            var curlen = this.data.graph[i].length;
            if(curlen <= prelength){
                var div = this.decompose(prelength,curlen);
                //console.log(div)
                var curpx = 0;
                for(var j = 0;j<curlen;j++){
                    var curname = i+"-"+j;
                    this.data.graph[i][curname][1]=div[j];
                    for(var k = 0;k<div[j];k++){
                        var pix = (i-1)+"-"+curpx;
                        curpx+=1;
                        this.data.graph[i][curname].push(pix);
                    }
                }
            }else{
                var div = this.decompose(curlen,prelength);
                var curpx = 0;
                for(var j=0;j<prelength;j++){
                    var curname = (i-1)+"-"+j;
                    for(var k=0;k<div[j];k++){
                        var pix = (i)+"-"+curpx;
                        //console.log(pix)
                        this.data.graph[i][pix][1]+=1;
                        this.data.graph[i][pix].push(curname);
                        curpx+=1;
                    }
                }
            }
            prelength = curlen;
        }
    }
}

