
class GF_Clothes {
    constructor(model, pattern) {
        this.numX = 3;
        this.numY = 4;
        this.modelId = model;
        this.patternId = pattern;
        this.renders = {};
        this.renderTextures = {};
        this.stages = {};
        this.animations = [];
        this.listMap = ["clothes", "sleeve"];
        this.caches = {};
        this.bounds = null;
        this.frame = 0;
        this.bh = 1;
        this.index = 0;

        this.readGroup(this.modelId, "model");
        this.readGroup(this.patternId, "pattern");
        this.waitForLoad(() => {
            this.setup();
        });
    }


    waitForLoad(callback) {
        var loadAll = true;

        for (var i in this.caches) {
            if (!this.caches[i]["loaded"]) {
                loadAll = false;
                break;
            }
        }


        if (!loadAll) {
            setTimeout(() => {
                this.waitForLoad(callback);
            }, 1000);
        } else {

            callback();
        }
    }


    setup() {
        this.setBlendMode();

        this.paint("clothes")
        this.paint("sleeve")
        this.combine();
        this.show();
    }


    combine() {

        this.result = new PIXI.Sprite();
        this.result.addChild(this["clothes"]);
        this.result.addChild(this["sleeve"]);

    }



    show() {
        this.containerS = PIXI.autoDetectRenderer(this.bounds["width"], this.bounds["height"], { transparent: true });
        $("#hh").append(this.containerS.view);


        this.containerS.render(this.result);

        this.containerDownload = new PIXI.RenderTexture(this.containerS,this.bounds["width"] , this.bounds["height"]);

        this.containerDownload.render(this.result);


        this.containerActive = PIXI.autoDetectRenderer(this.bounds["width"] / this.numX, this.bounds["height"], { transparent: true });

        $("#hh").append(this.containerActive.view);


        this.containerActive.render(this.result);






    }

    readGroup(id, rootPath = "model") {
        this[rootPath] = {};
        var rootPath2 = `images/${rootPath}`;
        let list = [`${rootPath2}/${id}_1.png`, `${rootPath2}/${id}_2.png`];

        for (var i in list) {
            var tmp = new Image();
            tmp.loaded = false;
            tmp.src = list[i];
            tmp.srcid = i;
            this.caches[list[i]] = tmp
            var p = this;
            tmp.onload = function () {
                this.loaded = true;
                var base = new PIXI.BaseTexture(this);
                var text = new PIXI.Texture(base);
                p[rootPath][p.listMap[this.srcid]] = new PIXI.Sprite(text);
                if (rootPath == "model") {
                    p.bounds = {
                        "width": this.naturalWidth,
                        "height": this.naturalHeight
                    }
                }
            }
        }
    }

    setBlendMode() {
        for (var i in this.pattern) {
            var data = this.pattern[i];
            data.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        }
    }


    paint(name) {

        var renderer = PIXI.autoDetectRenderer(this.bounds["width"], this.bounds["height"], { transparent: true });

        //var stage = new PIXI.Container();
        var sp = new PIXI.Sprite();


        sp.addChild(this.model[name]);

        var tmpListPattern = [];

        var smX = this.bounds["width"] / this.numX;
        var smY = this.bounds["height"] / this.numY;


        for (var y = 0; y < this.numY; y++) {
            for (var x = 0; x < this.numX; x++) {
                tmpListPattern[y * this.numX + x] = new PIXI.Sprite(this.pattern[name].texture.clone());
                if (y <= 2) {
                    tmpListPattern[y * this.numX + x].texture.frame = new PIXI.Rectangle(0, 0, smX, smY);
                } else {
                    tmpListPattern[y * this.numX + x].texture.frame = new PIXI.Rectangle(smX, 0, smX, smY);
                }
                tmpListPattern[y * this.numX + x].position.x = x * smX;
                tmpListPattern[y * this.numX + x].position.y = y * smY;
                tmpListPattern[y * this.numX + x].blendMode = PIXI.BLEND_MODES.MULTIPLY;
                sp.addChild(tmpListPattern[y * this.numX + x]);
            }
        }

        //console.log(this.pattern[name]);

        // this.pattern[name].texture.frame = new PIXI.Rectangle(0,0,32,48)

        // sp.addChild(this.pattern[name]);

        this.renders[name] = renderer;
        this.stages[name] = sp;

        this.renders[name].render(this.stages[name]);


        var renderTexture = new PIXI.RenderTexture(renderer, this.bounds["width"], this.bounds["height"]);
        this.renderTextures[name] = renderTexture;

        this.renderTextures[name].render(this.stages[name]);

        var tmpImg = renderTexture.getImage();

        var tmpBase = new PIXI.BaseTexture(tmpImg);
        var tmpText = new PIXI.Texture(tmpBase);

        this[name] = new PIXI.Sprite(tmpText);



        //renderer.render(stage);

        this.animations.push(() => {
            //this.renders[name].render(this.stages[name]);
            //this[name] = this.renders[name]
        });
    }


}

var hher = new GF_Clothes("a", "p");

animate();

function animate() {
    requestAnimationFrame(animate);
    if (hher.frame < 20) {
        hher.frame++;
    } else {

        //renderer2.render(s5);
        hher.index += hher.bh;

        if (hher.index == 2) {
            hher.bh = -1;
        }
        if (hher.index == 0) {
            hher.bh = 1;
        }
        hher.result.position.x = - hher.index * 32;
        // s6.position.x = - index * 32;
        hher.frame = 0;
    }

    hher.containerActive.render(hher.result);
}


function download() {
    fileData = hher.containerDownload.getBase64();
    $("#file").attr("href", fileData);
    $("#file")[0].click();

}