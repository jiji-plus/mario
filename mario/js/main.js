/*
	main.js
	
	@author shunichiro
	
	13/9/6
*/

/*
	定数
*/
var MAX_KURIBO = 16;
var MAX_ANIM = 4 * 32;

/*
	グローバル変数
*/
var g_Canvas;
var g_Ctx;
var g_Scene;	// シーン
var g_bLoaded;	// ロード

// キー
var g_bSpacePush = false;   // spaceキーフラグ
var g_bLeftPush = false;	// left
var g_bRightPush = false;	// right
var g_bUpPush = false;		// up
var g_bDownPush = false;	// down
var g_bAPush = false;       // Aキーフラグ
var g_bEnterPush = false;   // リターンキーフラグ
var g_bEnterPushOne = false;// リターンが押されたときのみ立つフラグ
/*
	fps
*/
var g_LastAnimationFrameTime = 0,
g_LastFpsUpdateTime = 0,
g_FpsElement;

/* 
	texture
*/
var g_MarioTex;
var g_MapTex;
var g_EnemyTex;

/*
	クラス
*/
var g_cMario;
var g_cKuribo = [];

/*
	マップ
*/
var g_MapChip = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,56,56,56,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,0,0,0,0,0,0,0,72,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,84,84,84,84,84,84,84,84,0,0,0,84,84,84,68,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,56,56,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,56,56,56,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,84,0,0,0,0,84,0,84,0,0,0,0,0,84,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,84,84,84,84,84,84,0,84,84,84,84,84,84,84,0,0,84,68,84,68,84,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,101,102,0,0,0,0,0,0,0,0,0,101,102,0,0,0,56,56,0,0,0,0,0,0,0,0,0,0,0,0,0,84,72,84,0,0,0,0,56,56,56,0,0,0,0,0,0,0,84,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,56,56,0,0,0,101,102,0,0,0,0,0,0,117,118,0,0,0,0,0,0,0,0,0,117,118,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,101,102,0,0,0,0,0,0,0,0,117,118,0,0,0,0,0,0,117,118,0,0,0,0,0,0,0,0,0,117,118,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,117,118,0,0,0,0,0,0,0,0,117,118,0,0,0,0,0,0,117,118,0,0,0,0,0,0,0,0,0,117,118,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,0,0,129,129,129,129,129,129,129,129,129,129,129,129,129,0,0,0,129,129,129,129,129,129,129,129,129,129,129,129],
];

// ステージテンポラリーマップ
var g_TempMap = [
         		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
         		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
         		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,56,56,56,0,0,0,0,0,0,0,0,0,0,0,0,0],
         		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
         		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
         		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
         		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,72,0,0,0,0,0,0,0,72,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,84,84,84,84,84,84,84,84,0,0,0,84,84,84,68,0,0,0,0],
         		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,56,56,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
         		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,56,56,56,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
         		[0,0,0,0,0,84,0,0,0,0,84,0,84,0,0,0,0,0,84,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
         		[0,0,0,0,0,84,84,84,84,84,84,0,84,84,84,84,84,84,84,0,0,84,68,84,68,84,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,101,102,0,0,0,0,0,0,0,0,0,101,102,0,0,0,56,56,0,0,0,0,0,0,0,0,0,0,0,0,0,84,72,84,0,0,0,0,56,56,56,0,0,0,0,0,0,0,84,0,0,0,0],
         		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,56,56,56,0,0,0,101,102,0,0,0,0,0,0,117,118,0,0,0,0,0,0,0,0,0,117,118,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
         		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,101,102,0,0,0,0,0,0,0,0,117,118,0,0,0,0,0,0,117,118,0,0,0,0,0,0,0,0,0,117,118,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
         		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,117,118,0,0,0,0,0,0,0,0,117,118,0,0,0,0,0,0,117,118,0,0,0,0,0,0,0,0,0,117,118,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
         		[129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,129,0,0,129,129,129,129,129,129,129,129,129,129,129,129,129,0,0,0,129,129,129,129,129,129,129,129,129,129,129,129],
         ];

/*
	アニメーション
*/
var g_AnimCnt = 0;
var ANIM_CHANGE;		// animation change num
var g_MapAnim = 0;			// マップアニメーション

/*
	定数
*/
var LOAD = 1;
/*
	onload
	
	最初に呼び出される関数
*/
onload = function () {
    // キャンバスに代入
    g_Canvas = document.getElementById('id_canvas1');   // JavaScript uses the id to find the <canvas> element:
    g_FpsElement = document.getElementById("fps");		// 読み込まれていない
    // cavasに対応していない
    if (!g_Canvas || !g_Canvas.getContext) {
        alert("html5に対応していないので、実行できません");
        return false;
    }

    g_Ctx = g_Canvas.getContext('2d');          // ctx
    
    g_Scene = LOAD;      // ロードシーンに移行
    g_bLoaded = false;
    
    // クラス生成
    g_cMario = new cMario();		// マリオクラス
    g_cMario.Init(0,416);
    // 9.追加(クリボ)
    for(var i = 0;i < MAX_KURIBO;++i)
    {
        g_cKuribo[i] = new cKuribo();
    }
    
    LoadTex();           // texture load
    Init();				// 初期化
    requestNextAnimationFrame(animate);		// loopスタート
    // キーの登録
    window.addEventListener('keydown', KeyDown, true);     
    window.addEventListener('keyup', KeyUp, true);      
};

/*
	変数などの初期化
*/
function Init(){
	// クリボーの位置
	/*
	for(var i = 0;i < MAX_KURIBO;++i){
		g_cKuribo[i].Init(100 + (100 * i),416,LEFT_DIR);
	}
	*/ 
	g_cKuribo[0].Init(800,416,LEFT_DIR);
	g_cKuribo[1].Init(1500,416,LEFT_DIR);
	g_cKuribo[2].Init(1600,416,LEFT_DIR);
	g_cKuribo[3].Init(1664,416,LEFT_DIR);
	g_cKuribo[4].Init(2736,160,LEFT_DIR);
	g_cKuribo[5].Init(2800,160,LEFT_DIR);
	g_cKuribo[6].Init(3136,416,LEFT_DIR);
	g_cKuribo[7].Init(3200,416,LEFT_DIR);	
	g_cKuribo[8].Init(256,288,LEFT_DIR);
	
	// map
	g_MapAnim = 0;			// マップアニメーション
	ANIM_CHANGE = 8;		// マップが変化する量
	for(var i = 0;i < g_MapChip.length;++i){
		for(var j = 0;j < g_MapChip[i].length;++j){
			g_TempMap[i][j] = g_MapChip[i][j];
		}
	}
}

function InitStage1(){
	g_cKuribo[0].Init(800,416,LEFT_DIR);
	g_cKuribo[1].Init(1500,416,LEFT_DIR);
	g_cKuribo[2].Init(1600,416,LEFT_DIR);
	g_cKuribo[3].Init(1664,416,LEFT_DIR);
	g_cKuribo[4].Init(2736,160,LEFT_DIR);
	g_cKuribo[5].Init(2800,160,LEFT_DIR);
	g_cKuribo[6].Init(3136,416,LEFT_DIR);
	g_cKuribo[7].Init(3200,416,LEFT_DIR);	
	g_cKuribo[8].Init(256,288,LEFT_DIR);
	
	// map
	g_MapAnim = 0;			// マップアニメーション
	ANIM_CHANGE = 8;		// マップが変化する量
	for(var i = 0;i < g_MapChip.length;++i){
		for(var j = 0;j < g_MapChip[i].length;++j){
			g_MapChip[i][j] = g_TempMap[i][j];
		}
	}
}

/*
	LoadTex
	
	テクスチャのロード
*/
function LoadTex(){
	g_MarioTex = new Image();
	g_MarioTex.src = "../img/Mario.png";
	g_MapTex = new Image();
	g_MapTex.src = "../img/mapchip2.png";
	g_EnemyTex = new Image();
    g_EnemyTex.src = "../img/enemy.png";
    g_bLoaded = true;
}

function animate(now) { 
    var fps = calculateFps(now); 
    Draw();		// 描画
    MapAnim();	// マップアニメーション
    if(g_cMario.State < DEAD_ACTION)
    {
	    g_cMario.Move(g_bRightPush,g_bLeftPush,g_bSpacePush,g_bUpPush,g_bDownPush,g_MapChip);
	    g_cMario.BlockAction(g_MapChip);		// 6.ブロックの破壊アニメーション
    }
    g_cMario.DeadAction();
    // 死亡戻り処理
    if(g_cMario.DeadBack()){
    	// 初期化
    	InitStage1();
    }
    // enemy
    for(var i = 0;i < MAX_KURIBO;++i){
    	g_cKuribo[i].Move(g_MapChip,99,g_cMario.MoveNumX);
    	g_cKuribo[i].Collision(g_cMario,g_MapChip);
    }
    
    requestNextAnimationFrame(animate);
 } 
           
/*
	Draw
	
	全般描画
*/
function Draw(){
	DrawMap(g_MapChip);
	g_cMario.Draw(g_Ctx,g_MarioTex,2,2);
	for(var i = 0;i < MAX_KURIBO;++i){
		g_cKuribo[i].Draw(g_Ctx,g_EnemyTex,g_cMario.MapScrollX);
	}
}

/*
	マップチップの描画
*/
function DrawMap(map){
	for(var i = 0;i < 15;++i){
		for(var j = g_cMario.MinMapX;j < g_cMario.MaxMapX;++j){
			{
				// animation 
				if(map[i][j] == FCOIN_MAP){
					g_Ctx.drawImage(g_MapTex, 32 * ((map[i][j] + 16) % 16) + g_MapAnim, 32 * Math.floor(map[i][j] / 16) , 32, 32, j * 32 -  g_cMario.MapScrollX, i * 32, 32, 32);
				}
				else if(map[i][j] >= OBJECT_MAP && map[i][j] <= BLOCK_MAP - 1){
					g_Ctx.drawImage(g_MapTex, 32 * ((map[i][j] + 16) % 16) + g_MapAnim, 32 * Math.floor(map[i][j] / 16) , 32, 32, j * 32 -  g_cMario.MapScrollX, i * 32, 32, 32);
				}
				else if(map[i][j] == COIN_MAP){
					
				}
				// not animation 
				else {
					// 512*512
					g_Ctx.drawImage(g_MapTex, 32 * ((map[i][j] + 16) % 16), 32 * Math.floor(map[i][j] / 16) , 32, 32, j * 32 -  g_cMario.MapScrollX, i * 32, 32, 32);
				}

				//g_Ctx.drawImage(g_MapTex, 32 * ((map[i][j] + 16) % 16), 32 * Math.floor(map[i][j] / 16) , 32, 32, j * 32, i * 32, 32, 32);

			}
		}
	}	
	// 6.追加
	// 壊れたブロックの描画
	for(var i = 0;i < MAX_BLOCK;++i){
		if(g_cMario.bBlockAtack[i])
		{
			g_Ctx.drawImage(g_MapTex, 128, 160 , 16, 16, g_cMario.BlockPosX[i][1] - g_cMario.MapScrollX,g_cMario.BlockPosY[i][1], 16, 16);	// 左上
			g_Ctx.drawImage(g_MapTex, 144, 160 , 16, 16, g_cMario.BlockPosX[i][3] - g_cMario.MapScrollX,g_cMario.BlockPosY[i][3], 16, 16);	// 右上
			g_Ctx.drawImage(g_MapTex, 144, 176 , 16, 16, g_cMario.BlockPosX[i][2] - g_cMario.MapScrollX,g_cMario.BlockPosY[i][2], 16, 16);	// 右下
			g_Ctx.drawImage(g_MapTex, 128, 176 , 16, 16, g_cMario.BlockPosX[i][0] - g_cMario.MapScrollX,g_cMario.BlockPosY[i][0], 16, 16);	// 左下
		}
		// ブロックの上昇描画
		if(g_cMario.bBlockUp[i])
		{
			g_Ctx.drawImage(g_MapTex, 0, 0 , 32, 32, g_cMario.BlockAtackX[i] - g_cMario.MapScrollX,g_cMario.BlockAtackPosY[i], 32, 32);		// 背景で塗りつぶす
			g_Ctx.drawImage(g_MapTex, 128, 160 , 32, 32, g_cMario.BlockAtackX[i] - g_cMario.MapScrollX,g_cMario.BlockAtackPosY[i] - g_cMario.BlockAtackAddY[i], 32, 32);	// ブロック上昇
		}
	}
	
	// 8.追加
	// ブロックを叩いた後のコインの描画
	for(var i = 0;i < MAX_COIN;++i){
		if(g_cMario.bCoin[i])
		{
			g_Ctx.drawImage(g_MapTex, 384, 96 , 32, 32, g_cMario.CoinX[i] - g_cMario.MapScrollX,g_cMario.CoinY[i], 32, 32);
		}
	}
	
	// キノコの描画
	if(g_cMario.bKinoko)
	{
		g_Ctx.drawImage(g_MapTex, 0, 480 , 32, 32, g_cMario.KinokoX - g_cMario.MapScrollX,g_cMario.KinokoY, 32, 32);
	}
}

/*
	MapAnim
	
	background animation
*/
function MapAnim(){
	if(++g_AnimCnt >= ANIM_CHANGE){
		g_AnimCnt = 0;
		g_MapAnim += 32;
		if(g_MapAnim >= MAX_ANIM){
			g_MapAnim = 0;
		}
	};
}


/*
	キーを押した時の操作
*/
function KeyDown(event) {
	var code = event.keyCode;       // どのキーが押されたか
	switch(code) {
	    // エンターキー
	    case 13:
	    	// 一回のみのプッシュ
	    	if(g_bEnterPush)g_bEnterPushOne = false;
	    	else g_bEnterPushOne = true;
	        g_bEnterPush = true;    
	        break;
	    // スペースキー
	    case 32:
            // スクロールさせないため
            event.returnValue = false;	// ie
            event.preventDefault();		// firefox
	        g_bSpacePush = true;
	        break;
			// ←キー
	    case 37:
	        g_bLeftPush = true;
	        break;
			// →キー
	    case 39:
	        g_bRightPush = true;
	        break;
			// ↑キー
	    case 38:
            event.returnValue = false;	// ie
            event.preventDefault();		// firefox
			g_bUpPush = true;
	        break;
			// ↓キー
	    case 40:
            event.returnValue = false;	// ie
            event.preventDefault();		// firefox
	        g_bDownPush = true;
	        break;
	    case 65:
	        // aキー
	        g_bAPush = true;
	        break;
	}
}

/*
	キーを離した時のイベント
*/
function KeyUp(event) {
	code = event.keyCode;
	switch(code) {
	    // エンターキー
	    case 13:
	        g_bEnterPush = false;
	        g_bEnterPushOne = false;
	        break;
	    // スペースキー
	    case 32:
	        g_bSpacePush = false;
	        break;
			// ←キー
	    case 37:
	        g_bLeftPush = false;
	        break;
	    case 39:
	        // →キー
	        g_bRightPush = false;
	        break;
	    case 38:
	        // ↑キー
			g_bUpPush = false;
	        break;
	    case 40:
	        // ↓キー
			g_bDownPush = false;
	        break;
	    case 65:
	        // aキー
	        g_bAPush = false;
	        break;
	}
}

/*
Reprinted from Core HTML5 Canvas
オリジナルインターバル設定
*/
window.requestNextAnimationFrame =
(function () {
var originalWebkitRequestAnimationFrame = undefined,
   wrapper = undefined,
   callback = undefined,
   geckoVersion = 0,
   userAgent = navigator.userAgent,
   index = 0,
   self = this;

// Workaround for Chrome 10 bug where Chrome
// does not pass the time to the animation function

if (window.webkitRequestAnimationFrame) {
  // Define the wrapper

  wrapper = function (time) {
    if (time === undefined) {
       time = +new Date();
    }
    self.callback(time);
  };

  // Make the switch
   
  originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;    

  window.webkitRequestAnimationFrame = function (callback, element) {
     self.callback = callback;

     // Browser calls the wrapper and wrapper calls the callback
     
     originalWebkitRequestAnimationFrame(wrapper, element);
  }
}

// Workaround for Gecko 2.0, which has a bug in
// mozRequestAnimationFrame() that restricts animations
// to 30-40 fps.

if (window.mozRequestAnimationFrame) {
  // Check the Gecko version. Gecko is used by browsers
  // other than Firefox. Gecko 2.0 corresponds to
  // Firefox 4.0.
  
  index = userAgent.indexOf('rv:');

  if (userAgent.indexOf('Gecko') != -1) {
     geckoVersion = userAgent.substr(index + 3, 3);

     if (geckoVersion === '2.0') {
        // Forces the return statement to fall through
        // to the setTimeout() function.

        window.mozRequestAnimationFrame = undefined;
     }
  }
}

return window.requestAnimationFrame   ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||

  function (callback, element) {
     var start,
         finish;


     window.setTimeout( function () {
        start = +new Date();
        callback(start);
        finish = +new Date();

        self.timeout = 1000 / 60 - (finish - start);

     }, self.timeout);
  };
}
)
();


/*
	fpsの計算
*/
function calculateFps(now) {
var fps = 1000 / (now - g_LastAnimationFrameTime);
g_LastAnimationFrameTime = now;

if (now - g_LastFpsUpdateTime > 1000) {
  g_LastFpsUpdateTime = now;
  g_FpsElement.innerHTML = fps.toFixed(0) + ' fps';
}
return fps; 
}
