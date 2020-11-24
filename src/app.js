/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.idleTexture = cc.textureCache.addImage("res/monster/skeleton/idle.png");
        this.textureAttack = cc.textureCache.addImage("res/monster/skeleton/attack.png");
        this.textureWalk = cc.textureCache.addImage("res/monster/skeleton/walk.png");
        this.velocity = 15;
        this.acc = 0;

        this.monster = new cc.Sprite();
        this.monster.setNormalizedPosition(0.5, 0.5);
        this.addChild(this.monster , 0);

        var btnAttack = new ccui.Button("res/HelloWorld.png", "res/HelloWorld.png", "res/HelloWorld.png");
        this.addChild(btnAttack, 0);
        btnAttack.setNormalizedPosition(1, 1);

        btnAttack.addTouchEventListener(this.onControl, this);
        this.btnAttack = btnAttack;

        this.idle();

        this.scheduleUpdate();

        return true;
    },
    onControl: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
            case ccui.Widget.TOUCH_MOVED:
                this.walk();
                this.acc = 1;
                break;
            case ccui.Widget.TOUCH_ENDED:
            case ccui.Widget.TOUCH_CANCELED:
                this.acc = -15;
        }
    },
    attack: function () {

        this.monster.stopAllActions();
        var frames = this.runFrames(this.textureAttack);
        this.monster.setTexture(frames[0]);
        var animation = new cc.Animation(frames, 1/12);
        this.monster.runAction(
            cc.sequence(
                cc.animate(animation),
                cc.callFunc(this.idle.bind(this))
            )
        );
    },
    walk: function () {
        this.velocity = 15;
        this.monster.stopAllActions();
        var frames = this.runFrames(this.textureWalk);
        this.monster.setTexture(frames[0]);
        var animation = new cc.Animation(frames, 1/12);
        this.monster.runAction(cc.animate(animation).repeatForever());

    },
    idle: function () {
        this.velocity = 0;
        this.acc = 0;
        this.monster.stopAllActions();
        var frames = this.runFrames(this.idleTexture);
        this.monster.setTexture(frames[0]);
        var animation = new cc.Animation(frames, 1/12);
        this.monster.runAction(cc.animate(animation).repeatForever());

    },
    move: function () {

    },
    runFrames: function (texture) {
        var frames = [];

        // manually add frames to the frame cache
        for (var i = 0; i < texture.getContentSize().width/150; i++) {
            frames.push(new cc.SpriteFrame(texture, cc.rect(150*i, 0, 150, 150)));
        }

        return frames;

    },
    update: function (dt) {
        this.velocity += dt*this.acc;
        if (this.velocity <= 0) {
            this.velocity = 0;
            this.acc = 0;
            return;
        }
        this.monster.x += dt*this.velocity;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

