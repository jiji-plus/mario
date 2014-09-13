/*
	mario.js
	
	@author shunichiro
	
	13/9/10
*/

// 定数
var LEFT_DIR =  1;	
var RIGHT_DIR = -1;
var INVICIBLE_TIME = 130;				// 無敵時間
var MAX_DOWN_SPEED = 9;					// 落下スピード

// 状態
var SMALL = 1;
var BIG = 2;
var FIRE = 3;
var INVISIBLE = 4;		// 無敵状態
var STAR = 5;
var DEAD_ACTION = 6
var DEAD = 7;
var POS_BACK = 8;
var GAME_OVER = 9;
var MAX_GAMEOVER = 3;
// ダッシュ
var WALK = 0;
var DASH = 1;
var DASH_CNT = 16;
var ANIM_CHANGE = 4;

// ジャンプ定数
var JUST_JUMP_TIME = 20;	// ジャストジャンプの有効時間
var MAX_GRAVITY = 10;		// 最大落下速度

// shot
var MAX_SHOT = 3;			// shot最大数
var SHOT_INTERVAL = 100;	// ショットの間隔
// map
var MAP_MAX = 4;			// 上右、下右、下左、上左の順に数値を入れる
var OBJECT_MAP = 64;		// オブジェクトとなるマップ番号
var BLOCK_MAP = 84;			// ジャンプで破壊できるブロック
var EMPTY_MAP = 0;		// ブロックを壊した後などの空のマップ
var EMPTY_BOX_MAP = 64;		// 空箱
var COIN_MAP = 68;		// コインブロック
var FCOIN_MAP = 56;		// フィールドのコインマップ
var KINOKO_MAP = 72;	// キノコマップ
var BACK_MAP = 0;		// 背景

// block
var MAX_BLOCK = 2;		// ブロックに対する処理最大数
var MAX_COIN = 2;		// コインに対する最大処理数

// debug
var g_bDebug = false;

/*
	marioクラス
*/
function cMario(){	
	// 変数(座標)
	this.PosX;					// x座標
	this.PosY;					// y座標
	this.BackPosX;				// スタート位置
	this.BackPosY;				// スタート位置
	this.AddNumY;				// yの加算量
	this.AddNumX;				// x座標移動加算量
	this.Dir;					// 向いている方向
	this.AnimX;					// アニメーションX
	this.AnimCnt;				// アニメーションカウント
	this.DashCnt;				// ダッシュさせるまでの時間
	this.DashState;				// 移動状態
	this.bJump;					// ジャンプフラグ
	this.JumpAddNum;			// ジャンプの上昇地
	this.JumpCnt;				// ジャンプカウンター
	// 6.追加
	this.Height;				// マリオの高さ
	// マップ変数
	this.MapX = [];				// マップ位置X(上右、下右、下左、上左の順に数値を入れる)
	this.MapY = [];				// マップ位置Y(上右、下右、下左、上左の順に数値を入れる)
	// 5.追加
	// スクロール
	this.MaxMapX;				// 最大の描画範囲X
	this.MinMapX;				// 最小の描画範囲X
	this.MapScrollX;			// スクロール量X
	this.MoveNumX;			// 総移動量X
	this.ScrollEndX;		// スクロールが終わりとなる終点X
	// 7.追加(block)
	this.bHeadCollision;	// 頭のブロックとの当たり判定フラグ
	this.bBlockAtack = [];	// ブロックを叩いたフラグ
	this.BlockPosX = [[],[],[],[]];	// 壊れたブロックのX座標
	this.BlockPosY = [[],[],[],[]];	// 壊れたブロックのY座標
	this.BlockAddY = [];	// 壊れたブロックの加算量Y
	this.BlockIndex; 		// 使用しているブロックのindex
	// キノコ
	this.bKinoko;			// キノコ出現フラグ
	this.KinokoX;			// キノコX座標
	this.KinokoY;			// キノコY座標
	this.KinokoAddX;		// キノコ加算量X
	this.KinokoAddY;		// キノコ加算量Y
	// キノコマップ変数
	this.KinokoMapX = [];
	this.KinokoMapY = [];
	// 8.追加
	this.AnimY;				// アニメーションY
	this.State;				// マリオの状態(小さいとか、キノコをとったとか)
	this.IndexPoint;		// 当たり判定の頂点の数
	// 9.追加(ブロックにおけるコイン)
	this.CoinX = [];				// コインのX座標
	this.CoinY = [];				// コインのY座標
	this.bCoin = [];				// コイン出現フラグ
	this.CoinCnt = [];				// コインを上昇させる回数
	this.CoinIndex;					// コインのインデックス
	this.CoinNum;					// コインの所持数
	this.Life;						// 残機
	// 10.追加
	this.DeadCnt;			// 死ぬ際のカウンター
	this.bInvincible;		// 無敵フラグ
	this.InvincibleTime;	// 無敵時間
	// 11.追加(ブロックを叩いた効果)
	this.BlockAtackX = [];		// 叩いたブロックの効果X
	this.BlockAtackY = [];		// 叩いたブロックの効果Y
	this.BlockAtackCnt = [];	// 叩いたブロックの効果有効時間
	this.BlockAtackIndex;		// 叩いたブロックのインデックス
	this.bBlockUp = [];				// 叩いたブロックを上昇させるフラグ
	this.BlockAtackAddY = [];		// 叩いたブロック上昇値
	this.BlockAtackPosY = [];		// 叩いたブロック位置Y
}

/*
	初期化関数
*/
cMario.prototype.Init = function(x,y){
	this.PosX = x;
	this.PosY = y;
	this.BackPosX = x;				// スタート位置
	this.BackPosY = y;				// スタート位置
	this.AddNumY = 0;			// y加算量
	this.Dir = RIGHT_DIR;
	this.AddNumX = 2;
	this.AnimX = 0;
	this.AnimCnt = 0;			// アニメーションカウント
	this.DashCnt = 0;			// ダッシュさせるまでの時間
	this.DashState = WALK;		// 移動状態
	this.bJump = false;			// ジャンプフラグ
	this.JumpAddNum = 5;		// ジャンプの上昇地
	this.JumpCnt = 0;			// ジャンプカウンター
	// 7.追加
	this.Height = 32;			// マリオの高さ
	// マップ変数
	this.MapX[0] = Math.floor((this.PosX + 31) / 32);	// 0-32で0,33-64で1(右)
	this.MapX[1] = this.MapX[0];	// 右
	this.MapX[2] = Math.floor((this.PosX) / 32);	// 左
	this.MapX[3] = this.MapX[2];		// 左
	// Y
	this.MapY[0] = Math.floor((this.PosY) / 32);	// 0-32で0,33-64で1(上)
	this.MapY[1] = Math.floor((this.PosY + 31) / 32);	// 0-32で0,33-64で1(下)
	this.MapY[2] = this.MapY[1];						// 0-32で0,33-64で1(下)
	this.MapY[3] = this.MapY[0];						// 0-32で0,33-64で1(上)
	// 5.追加
	// スクロール
	this.MaxMapX = 21;			// 最大の描画範囲X
	this.MinMapX = 0;			// 最小の描画範囲X
	this.MapScrollX = 0;		// スクロール量X
	this.MoveNumX = 0;			// 総移動量X
	this.ScrollEndX = (100 - 10) * 32 - 16;		// スクロールの終わりとなる終点X
	// 7.追加
	this.bHeadCollision = false;	// 頭のブロックとの当たり判定フラグ
	for(var i = 0;i < MAX_BLOCK;++i){
		this.bBlockAtack[i] = false;	// ブロックを叩いたフラグ
		this.BlockAddY[i] = 0;			// 壊れたブロックの加算量Y
		for(var j = 0;j < 4;++j){
			this.BlockPosX[i][j] = 0;			// 壊れたブロックのX座標
			this.BlockPosY[i][j] = 0;			// 壊れたブロックのY座標
		}
	}
	this.BlockIndex = 0; 				// 使用しているブロックのindex
	// キノコ
	this.bKinoko = false;			// キノコ出現フラグ
	this.KinokoX = 0;			// キノコX座標
	this.KinokoY = 0;			// キノコY座標
	this.KinokoAddX = 0;		// キノコ加算量X
	this.KinokoAddY = 0;		// キノコ加算量Y
	// キノコマップ変数
	this.KinokoMapX[0] = Math.floor((this.KinokoX + 31) / 32);	// 0-32で0,33-64で1(右)
	this.KinokoMapX[1] = this.KinokoMapX[0];	// 右
	this.KinokoMapX[2] = Math.floor((this.KinokoX) / 32);	// 左
	this.KinokoMapX[3] = this.KinokoMapX[2];		// 左
	// Y
	this.KinokoMapY[0] = Math.floor((this.KinokoY) / 32);	// 0-32で0,33-64で1(上)
	this.KinokoMapY[1] = Math.floor((this.KinokoY + 31) / 32);	// 0-32で0,33-64で1(下)
	this.KinokoMapY[2] = this.KinokoMapY[1];						// 0-32で0,33-64で1(下)
	this.KinokoMapY[3] = this.KinokoMapY[0];						// 0-32で0,33-64で1(上)
	// 8.追加
	this.AnimY = 0;				// アニメーションY
	this.State = SMALL;			// マリオの状態(小さいとか、キノコをとったとか)
	this.IndexPoint = 4;		// 当たり判定の頂点の数
	// 9.追加(ブロックにおけるコイン)
	for(var i = 0;i < MAX_COIN;++i){
		this.CoinX[i] = 0;
		this.CoinY[i] = 0;
		this.CoinCnt[i] = 0;				// コインを上昇させる回数
		this.bCoin[i] = false;
	}
	this.CoinIndex = 0;
	this.CoinNum = 0;					// コインの所持数
	this.Life = 3;						// 残機
	// 10.追加
	this.DeadCnt = 0;			// 死ぬ際のカウンター
	this.bInvincible = false;		// 無敵フラグ
	this.InvincibleTime = 0;	// 無敵時間
	// 11.追加(ブロックを叩いた効果)
	for(var i = 0;i < MAX_BLOCK;++i){
		this.BlockAtackX[i] = 0;		// 叩いたブロックの効果X
		this.BlockAtackY[i] = 0;		// 叩いたブロックの効果Y
		this.BlockAtackCnt[i] = 0;		// 叩いたブロックの効果有効時間
		this.bBlockUp[i] = false;				// 叩いたブロックを上昇させるフラグ
		this.BlockAtackAddY[i] = 0;		// 叩いたブロック上昇値
		this.BlockAtackPosY[i] = 0;		// 叩いたブロック位置Y
	}
	this.BlockAtackIndex = 0;			// 叩いたブロックのインデックス
}

/*
	死亡した際の位置初期化
*/
cMario.prototype.DeadInit = function(x,y){
	this.PosX = x;
	this.PosY = y;
	this.BackPosX = x;				// スタート位置
	this.BackPosY = y;				// スタート位置
	this.AddNumY = 0;			// y加算量
	this.Dir = RIGHT_DIR;
	this.AddNumX = 2;
	this.AnimX = 0;
	this.AnimCnt = 0;			// アニメーションカウント
	this.DashCnt = 0;			// ダッシュさせるまでの時間
	this.DashState = WALK;		// 移動状態
	this.bJump = false;			// ジャンプフラグ
	this.JumpAddNum = 5;		// ジャンプの上昇地
	this.JumpCnt = 0;			// ジャンプカウンター
	// 7.追加
	this.Height = 32;			// マリオの高さ
	// マップ変数
	this.MapX[0] = Math.floor((this.PosX + 31) / 32);	// 0-32で0,33-64で1(右)
	this.MapX[1] = this.MapX[0];	// 右
	this.MapX[2] = Math.floor((this.PosX) / 32);	// 左
	this.MapX[3] = this.MapX[2];		// 左
	// Y
	this.MapY[0] = Math.floor((this.PosY) / 32);	// 0-32で0,33-64で1(上)
	this.MapY[1] = Math.floor((this.PosY + 31) / 32);	// 0-32で0,33-64で1(下)
	this.MapY[2] = this.MapY[1];						// 0-32で0,33-64で1(下)
	this.MapY[3] = this.MapY[0];						// 0-32で0,33-64で1(上)
	// 5.追加
	// スクロール
	this.MaxMapX = 21;			// 最大の描画範囲X
	this.MinMapX = 0;			// 最小の描画範囲X
	this.MapScrollX = 0;		// スクロール量X
	this.MoveNumX = 0;			// 総移動量X
	this.ScrollEndX = (100 - 10) * 32 - 16;		// スクロールの終わりとなる終点X
	// 7.追加
	this.bHeadCollision = false;	// 頭のブロックとの当たり判定フラグ
	for(var i = 0;i < MAX_BLOCK;++i){
		this.bBlockAtack[i] = false;	// ブロックを叩いたフラグ
		this.BlockAddY[i] = 0;			// 壊れたブロックの加算量Y
		for(var j = 0;j < 4;++j){
			this.BlockPosX[i][j] = 0;			// 壊れたブロックのX座標
			this.BlockPosY[i][j] = 0;			// 壊れたブロックのY座標
		}
	}
	this.BlockIndex = 0; 				// 使用しているブロックのindex
	// キノコ
	this.bKinoko = false;			// キノコ出現フラグ
	this.KinokoX = 0;			// キノコX座標
	this.KinokoY = 0;			// キノコY座標
	this.KinokoAddX = 0;		// キノコ加算量X
	this.KinokoAddY = 0;		// キノコ加算量Y
	// キノコマップ変数
	this.KinokoMapX[0] = Math.floor((this.KinokoX + 31) / 32);	// 0-32で0,33-64で1(右)
	this.KinokoMapX[1] = this.KinokoMapX[0];	// 右
	this.KinokoMapX[2] = Math.floor((this.KinokoX) / 32);	// 左
	this.KinokoMapX[3] = this.KinokoMapX[2];		// 左
	// Y
	this.KinokoMapY[0] = Math.floor((this.KinokoY) / 32);	// 0-32で0,33-64で1(上)
	this.KinokoMapY[1] = Math.floor((this.KinokoY + 31) / 32);	// 0-32で0,33-64で1(下)
	this.KinokoMapY[2] = this.KinokoMapY[1];						// 0-32で0,33-64で1(下)
	this.KinokoMapY[3] = this.KinokoMapY[0];						// 0-32で0,33-64で1(上)
	// 8.追加
	this.AnimY = 0;				// アニメーションY
	this.State = SMALL;			// マリオの状態(小さいとか、キノコをとったとか)
	this.IndexPoint = 4;		// 当たり判定の頂点の数
	// 10.追加
	this.DeadCnt = 0;			// 死ぬ際のカウンター
	this.bInvincible = false;		// 無敵フラグ
	this.InvincibleTime = 0;	// 無敵時間
	// 11.追加(ブロックを叩いた効果)
	for(var i = 0;i < MAX_BLOCK;++i){
		this.BlockAtackX[i] = 0;		// 叩いたブロックの効果X
		this.BlockAtackY[i] = 0;		// 叩いたブロックの効果Y
		this.BlockAtackCnt[i] = 0;		// 叩いたブロックの効果有効時間
		this.bBlockUp[i] = false;				// 叩いたブロックを上昇させるフラグ
		this.BlockAtackAddY[i] = 0;		// 叩いたブロック上昇値
		this.BlockAtackPosY[i] = 0;		// 叩いたブロック位置Y
	}
	this.BlockAtackIndex = 0;			// 叩いたブロックのインデックス
}


/*
	描画
*/
cMario.prototype.Draw = function(img,tex,offsetX,offSetY){
	if(this.Dir == LEFT_DIR)
	{
		img.save();
		img.transform(-1, 0, 0, 1, 0, 0);
		if(this.bInvincible)
		{
			img.globalAlpha = 0.4;
		}
		//img.drawImage(tex, this.AnimX, this.AnimY, 32, this.Height, -this.PosX - 32, this.PosY - (this.Height - 32), 32, this.Height);
		img.drawImage(tex, this.AnimX, this.AnimY, 32, this.Height, -this.PosX - 32, this.PosY, 32, this.Height);
		img.restore();
	}
	else
	{
		if(this.bInvincible)
		{
			img.save();
			img.globalAlpha = 0.4;
			img.drawImage(tex, this.AnimX, this.AnimY, 32, this.Height, this.PosX, this.PosY, 32, this.Height);
			img.restore();
		}
		else
		{
			img.drawImage(tex, this.AnimX, this.AnimY, 32, this.Height, this.PosX, this.PosY, 32, this.Height);
		}
	}
}

/*
	動き
*/
cMario.prototype.Move = function(bRight,bLeft,bSpace,bJump,bDown,map){
	// 上用デバック
	if(g_bAPush)
	{
		this.PosY += 1;
	}
	
	
	if(g_bEnterPush)
	{
		this.PosY -= 1;
	}
	
	// 右キーが押された
	// 9.しゃがみ状態では進ませない
	if(bRight && !bDown)
	{
		// ダッシュボタンが押されている
		if(bSpace)
		{
			this.DashState = DASH;
			this.AddNumX = 4;
			this.AnimX = 64;		// ダッシュ用のアニメ
			// 何回でアニメーションを変えるか
			if(this.AnimCnt++ >= ANIM_CHANGE - 1)
	 		{
				if(this.AnimX == 64)
				{	
					this.AnimX = 96;	// 次のコマへ
				}
				else
				{
					this.AnimX = 64;
				}
				this.AnimCnt = 0;
			}
		}
		else
		{
			this.AddNumX = 2;
			// 何回でアニメーションを変えるか
			if(this.AnimCnt++ >= ANIM_CHANGE)
			{
				if(this.AnimX == 0)
				{	
					this.AnimX = 32;	// 次のコマへ
				}
				else
				{
					this.AnimX = 0;
				}
				this.AnimCnt = 0;
			}
		}
		this.Dir = RIGHT_DIR;
		this.CollisionX(map,this.MoveNumX + this.AddNumX);		// オブジェクトとの当たり判定
		this.PosX += this.AddNumX;
		this.MoveNumX += this.AddNumX;
		
		this.MapX[0] = Math.floor((this.MoveNumX + 31) / 32);	// 0-32で0,33-64で1(右)
		this.MapX[1] = this.MapX[4] = this.MapX[0];	//   右
		this.MapX[2] = Math.floor(this.MoveNumX / 32);	// 左
		this.MapX[3] = this.MapX[5] = this.MapX[2];		// 左
		// 配列外処理
		if(this.MapX[0] >= 100)
		{
			this.MapX[0] = this.MapX[1] = this.MapX[4] = 99;
		}
		if(this.MapX[2] >= 100)
		{
			this.MapX[2] = this.MapX[3] = this.MapX[5]= 99;
		}
		if(this.MapX[0] < 0)
		{
			this.MapX[0] = this.MapX[1] = this.MapX[4] = 0;
		}
		if(this.MapX[2] < 0)
		{
			this.MapX[2] = this.MapX[3] = this.MapX[5] = 0;
		}
		
	}
	// 左キーが押された
	// 9.しゃがみ状態では進ませない
	else if(bLeft  && !bDown)
	{
		// ダッシュボタンが押されている
		if(bSpace)
		{
			this.DashState = DASH;
			this.AddNumX = 4;
			this.AnimX = 64;		// ダッシュ用のアニメ
			// 何回でアニメーションを変えるか
			if(this.AnimCnt++ >= ANIM_CHANGE - 1)
			{
				if(this.AnimX == 64)
				{	
					this.AnimX = 96;	// 次のコマへ
				}
				else
				{
					this.AnimX = 64;
				}
				this.AnimCnt = 0;
			}
		}
		else
		{
			this.AddNumX = 2;
			// 何回でアニメーションを変えるか
			if(this.AnimCnt++ >= ANIM_CHANGE)
			{
				if(this.AnimX == 0)
				{	
					this.AnimX = 32;	// 次のコマへ
				}
				else
				{
					this.AnimX = 0;
				}
				this.AnimCnt = 0;
			}
		}
		this.Dir = LEFT_DIR;
		this.CollisionX(map,this.MoveNumX - this.AddNumX);		// オブジェクトとの当たり判定
		this.PosX -= this.AddNumX;
		this.MoveNumX -= this.AddNumX;
		// 8.追加
		this.MapX[0] = Math.floor((this.MoveNumX + 31) / 32);	// 0-32で0,33-64で1(右)
		this.MapX[1] = this.MapX[4] = this.MapX[0];	//   右
		this.MapX[2] = Math.floor(this.MoveNumX / 32);	// 左
		this.MapX[3] = this.MapX[5] = this.MapX[2];		// 左	

		// 配列外処理
		if(this.MapX[0] >= 100)
		{
			this.MapX[0] = this.MapX[1] = this.MapX[4] = 99;
		}
		if(this.MapX[2] >= 100)
		{
			this.MapX[2] = this.MapX[3] = this.MapX[5] = 99;
		}
		if(this.MapX[0] < 0)
		{
			this.MapX[0] = this.MapX[1] = this.MapX[4] = 0;
		}
		if(this.MapX[2] < 0)
		{
			this.MapX[2] = this.MapX[3] = this.MapX[5] = 0;
		}
	}

	// しゃがむボタン(ジャンプ状態ではしゃがめない)
 	if(bDown && !this.bJump)
 	{
		if(this.State == BIG)
		{
			// しゃがみ状態ではない
			if(this.Height != 36)
			{
				this.PosY += 16;		// 描画量が増える分減算させる
				this.AnimX = 352;
				this.IndexPoint = 4;
				this.Height = 36;
				this.AnimY = 60;
				this.CollisionY(map,this.PosY);
				this.DefineMapY(14);	
			}
		}
	}
	else
	{
		if(this.State == BIG)
		{
			// しゃがみキー離された
			if(this.Height == 36)
			{
				this.AnimX = 0;
				this.AnimY = 44;
				this.Height = 52;
				if(this.AnimX != 352)
				{
					this.PosY -= 16;		// 描画量が増える分減算させる
					this.CollisionY(map,this.PosY);
					this.DefineMapY(14);
					this.IndexPoint = 6;
				}			
			}
		}
	}
	// ジャンプキーが押された
	if(bJump)
	{  
		// ジャンプフラグ
		if(!this.bJump)
		{
			this.bJump = true;
			// ダッシュ中はジャンプ力を上げる
			if(bSpace) this.AddNumY = 8;		// ジャンプさせる
			else this.AddNumY = 6;
			this.JumpAddNum = 5;				// ジャンプ上昇値
			this.JumpCnt = 0;
		}
		else
		{
			if(this.JumpCnt % 2 == 0 && this.JumpAddNum > 0)
			{
				this.AddNumY += this.JumpAddNum;		// キーを長押しすればジャンプ力が上がる
				this.JumpAddNum -= 1;
			}
		}
	}
	else
	{
		// ジャンプキーを離したときに再び上昇させない
		this.JumpAddNum = 0;
	}

	 
	// ジャンプアクション
	if(this.bJump)
	{
		// ジャンプ時のアニメーション
		if(bSpace)this.AnimX = 160;
		else this.AnimX = 128;
		// 当たりチェック
		this.CollisionY(map,this.PosY - this.AddNumY);
		this.PosY -= this.AddNumY;		// 上昇
		this.DefineMapY(14);					// マップ座標Yを決める
		// 頭に当たり判定があった場合にY加算量を減らすようにする
		if(this.bHeadCollision)
		{
			this.AddNumY = 0;		
			this.bHeadCollision = false;
			this.JumpAddNum = 0;		// 上昇させない
		}
		if(this.JumpCnt++ % 2 == 0)
		{
			this.AddNumY -= 2;
			// 最大落下速度
			if(this.AddNumY < -MAX_GRAVITY)
			{
				this.AddNumY = -MAX_GRAVITY;
			}
		}
	}
	// 重力処理
	else
	{
		if(!g_bDebug)
		{
			if(this.JumpCnt == 0)
			{
				this.AddNumY -= 1;
			}
			// タイマーをかける
			else if(this.JumpCnt++ % 2 == 0)
			{
				this.AddNumY -= 2;
				// 最大落下速度
				if(this.AddNumY < -MAX_GRAVITY)
				{
					this.AddNumY = -MAX_GRAVITY;
				}
			}
			this.CollisionY(map,this.PosY - this.AddNumY);
			// 6.空中にいる
			if(this.AddNumY != 0)
			{
				this.bJump = true;	// ジャンプさせないようにする	
			}
			this.PosY -= this.AddNumY;		// 上昇
			this.DefineMapY(14);	
		}
		else
		{
			this.CollisionY(map,this.PosY);
			this.DefineMapY(14);
		}
	}
	
	// スクロール処理
	{
		// スクロール基準点を越えたら
		if(this.MoveNumX >= 304 && this.MoveNumX < this.ScrollEndX)
		{
			this.MapScrollX = this.MoveNumX - 304;		// マップスクロール量
			this.PosX = 304;							// 固定
			// マップ描画値
			this.MaxMapX = 21 + Math.floor(this.MapScrollX / 32);			// 最大の描画範囲X
			this.MinMapX = this.MaxMapX - 21;								// 最小の描画範囲X
		}
		// スクロールの終点まで来たらスクロールを止め る
		else if(this.MoveNumX >= this.ScrollEndX)
		{
			this.MapScrollX = this.ScrollEndX - 304;		// マップスクロール量
			this.MaxMapX = 20 + Math.floor((this.MapScrollX + 16) / 32);			// 最大の描画範囲X
			if(this.MaxMapX >= 100) this.MaxMapX = 100;
			this.MinMapX = this.MaxMapX - 21;								// 最小の描画範囲X
			this.PosX = this.MoveNumX - this.MapScrollX;	// 表示座標
		}
	}
	
	// 無敵処理
	if(this.bInvincible)
	{
		if(this.InvincibleTime++ >= 180)
		{
			this.bInvincible = false;
		}
	}
	
	// 11.叩いたブロックの有効時間
	{
		for(var i = 0;i < MAX_BLOCK;++i){
			if( this.BlockAtackCnt[i] == 2 || this.BlockAtackCnt[i] == 1)
			{
				this.BlockAtackCnt[i]++;
			}
			else if(this.BlockAtackCnt[i] > 2)
			{
				//this.BlockAtackX[i] = 0
				this.BlockAtackY[i] = 0
				this.BlockAtackCnt[i] = 0
			}
		}
	}
}

/*
	死亡処理
*/
cMario.prototype.DeadAction = function(){
	if(this.State == DEAD_ACTION)
	{
		this.PosY -= this.AddNumY;		// 上昇と下降
		if(this.AddNumY >= -MAX_GRAVITY)
		{
			this.AddNumY -= 1;
		}
		if(this.PosY > 480)
		{
			this.State = DEAD;		// 死亡
		}
	}
	// 落下死亡
	if(this.PosY > 480){
		this.State = DEAD;
	}
}

/*
 * 死亡時位置戻し
 */
cMario.prototype.DeadBack = function(){
	if(this.State == DEAD){
		this.DeadInit(this.BackPosX, this.BackPosY);
		return true;
	}
	return false;
}

/*
 * DefineMapX
 * 
 * mapchip x座標を決める
 */
cMario.prototype.DefineMapX = function(map,posX){
	// マップ変数に移動後の座標を代入
	this.MapX[0] = Math.floor((posX + 31) / 32);	// 0-32で0,33-64で1(右)
	this.MapX[1] = this.MapX[0];	//   右
	this.MapX[2] = Math.floor(posX / 32);	// 左
	this.MapX[3] = this.MapX[2];		// 左
	// 配列外処理
	if(this.MapX[0] >= 100)
	{
		this.MapX[0] = this.MapX[1] = this.MapX[4] = 99;
	}
	if(this.MapX[2] >= 100)
	{
		this.MapX[2] = this.MapX[3] = this.MapX[5] = 99;
	}
	if(this.MapX[0] < 0)
	{
		this.MapX[0] = this.MapX[1] = this.MapX[4] =  0;
	}
	if(this.MapX[2] < 0)
	{
		this.MapX[2] = this.MapX[3] = this.MapX[5] = 0;
	}
	// 8.追加
	// キノコを取った後の真ん中の頂点
	this.MapX[4] = this.MapX[0];			// 0-32で0,33-64で1(右)
	this.MapX[5] = this.MapX[2];				// 左
}

/*
	DefineMapY
	
	Y軸のマップ座標を決める
	
	maxY = Y軸の最大配列
*/
cMario.prototype.DefineMapY = function(maxY){
	this.MapY[0] = Math.floor((this.PosY) / 32);			// 0-32で0,33-64で1(上)
	this.MapY[1] = Math.floor((this.PosY + (this.Height - 1)) / 32);			// 0-32で0,33-64で1(下)
	this.MapY[2] = this.MapY[1];					// 0-32で0,33-64で1(下)
	this.MapY[3] = this.MapY[0];					// 0-32で0,33-64で1(上)
	// 配列外対策(上)
	if(this.MapY[0] > maxY)
	{
		this.MapY[0] = this.MapY[3] = maxY;
	}
	// 配列外対策(下)
	if(this.MapY[1] > maxY)
	{
		this.MapY[1] = this.MapY[2] = 14;
	}
	// 画面下配列外対策
	if(this.MapY[0] < 0)
	{
		this.MapY[0] = this.MapY[3] = 0;
	}
	// 配列外対策(下)
	if(this.MapY[1] < 0)
	{
		this.MapY[1] = this.MapY[2] = 0;
	}
	// 8.追加
	// キノコを取った後の真ん中の頂点
	this.MapY[4] = Math.floor((this.PosY + 20) / 32);			// 0-32で0,33-64で1(真ん中)
	this.MapY[5] = this.MapY[4];
	// 配列外
	if(this.MapY[4] > maxY)
	{
		this.MapY[4] = this.MapY[5] = maxY;
	}
	if(this.MapY[4] < 0)
	{
		this.MapY[4] = this.MapY[5] = 0;
	}
}

/*
	オブジェクトとの当たり判定X
*/
cMario.prototype.CollisionX = function(map,posX){
	// マップ変数に移動後の座標を代入
	this.MapX[0] = Math.floor((posX + 31) / 32);	// 0-32で0,33-64で1(右)
	this.MapX[1] = this.MapX[0];	//   右
	this.MapX[2] = Math.floor(posX / 32);	// 左
	this.MapX[3] = this.MapX[2];		// 左
	// 配列外処理
	if(this.MapX[0] >= 100)
	{
		this.MapX[0] = this.MapX[1] = this.MapX[4] = 99;
	}
	if(this.MapX[2] >= 100)
	{
		this.MapX[2] = this.MapX[3] = this.MapX[5] = 99;
	}
	if(this.MapX[0] < 0)
	{
		this.MapX[0] = this.MapX[1] = this.MapX[4] =  0;
	}
	if(this.MapX[2] < 0)
	{
		this.MapX[2] = this.MapX[3] = this.MapX[5] = 0;
	}
	// 8.追加
	// キノコを取った後の真ん中の頂点
	this.MapX[4] = this.MapX[0];			// 0-32で0,33-64で1(右)
	this.MapX[5] = this.MapX[2];				// 左

	// キャラクターの四隅にオブジェクトが触れているかをチェック
	for(var i = 0;i < this.IndexPoint;++i){
		// キャラクター四隅のいずれかがオブジェクトに触れた
		if(map[this.MapY[i]][this.MapX[i]] >= OBJECT_MAP)
		{
			// (加算される前の)中心点からの距離を見る
			var vecX = Math.abs((this.MoveNumX + 16) - ((this.MapX[i] * 32) + 16));
			//var vecX = ((this.PosX + 16) - ((this.MapX[i] * 32) + 16));
			// Xの加算量調整
			this.AddNumX = Math.abs(32 - vecX);
		}
	}	
}

/*
	オブジェクトとの当たり判定Y
	
	posY = yの加算量とポジションを足した値
	map = 対象となるマップ配列
*/
cMario.prototype.CollisionY = function(map,posY){
	this.MapY[0] = Math.floor((posY) / 32);			// 0-32で0,33-64で1(上)
	this.MapY[1] = Math.floor((posY + (this.Height - 1)) / 32);			// 0-32で0,33-64で1(下)
	this.MapY[2] = this.MapY[1];					// 0-32で0,33-64で1(下)
	this.MapY[3] = this.MapY[0];					// 0-32で0,33-64で1(上)
	// 配列外対策(上)
	if(this.MapY[0] > 14)
	{
		this.MapY[0] = 14;
		this.MapY[3] = 14;
	}
	// 配列外対策(下)
	if(this.MapY[1] > 14)
	{
		this.MapY[1] = this.MapY[2] = 14;
	}
	// 画面下配列外対策
	if(this.MapY[0] < 0)
	{
		this.MapY[0] = 0;
		this.MapY[3] = 0;
	}
	// 配列外対策(下)
	if(this.MapY[1] < 0)
	{
		this.MapY[1] = this.MapY[2] = 0;
	}
	// 8.追加
	// キノコを取った後の真ん中の頂点
	this.MapY[4] = Math.floor((posY + 20) / 32);			// 0-32で0,33-64で1(真ん中)
	this.MapY[5] = this.MapY[4];
	// 配列外
	if(this.MapY[4] > 14)
	{
		this.MapY[4] = this.MapY[5] = 14;
	}
	if(this.MapY[4] < 0)
	{
		this.MapY[4] = this.MapY[5] = 0;
	}
	
	
	// キャラクターの四隅にオブジェクトが触れているかをチェック
	for(var i = 0;i < this.IndexPoint;++i){
		// キャラクター四隅のいずれかがオブジェクトに触れた
		if(map[this.MapY[i]][this.MapX[i]] >= OBJECT_MAP)
	 	{
			// 距離を見る
       		var vecY = ((this.PosY + 16) - ((this.MapY[i] * 32) + 16));
			// 上から当たっている
			if(vecY > 0)
			 {
				// Yの加算量調整
				this.AddNumY = Math.abs(32 - vecY);
				//this.AddNumY = Math.abs(this.Height - vecY);
				// ブロック破壊処理
				{
					if(map[this.MapY[i]][this.MapX[i]] == BLOCK_MAP)
					{
						// 11.敵を上昇させるなどの処理
						this.BlockUp(i,true);
						
						// 大きい場合はブロックを破壊させる
						if(this.State == BIG || this.State == FIRE)
						{
							map[this.MapY[i]][this.MapX[i]] = EMPTY_MAP;		// 空のマップにする
							// ブロックのアニメーション
							{	
								this.bBlockAtack[this.BlockIndex] = true;				// ブロック破壊アニメーション開始
								this.BlockPosX[this.BlockIndex][0] = this.BlockPosX[this.BlockIndex][1]= this.MapX[i] * 32;	// 壊れたブロックのX座標(0,1は←側)
								this.BlockPosX[this.BlockIndex][2] = this.BlockPosX[this.BlockIndex][3]= this.MapX[i] * 32 + 16;	// 壊れたブロックのX座標(2,3は→側)
								this.BlockPosY[this.BlockIndex][0] = this.BlockPosY[this.BlockIndex][2] = this.MapY[i] * 32 + 16;	// 壊れたブロックのY座標(0,2は↓側)
								this.BlockPosY[this.BlockIndex][1] = this.BlockPosY[this.BlockIndex][3] = this.MapY[i] * 32 - 16;	// 壊れたブロックのY座標(1,3は↑側)				
								this.BlockAddY[this.BlockIndex] = 10;					// 壊れたブロックの加算量Y
								if(++this.BlockIndex >= MAX_BLOCK)this.BlockIndex = 0;	// 添え字戻す
							}
						}
					}
					// キノコのブロック
					else if(map[this.MapY[i]][this.MapX[i]] == KINOKO_MAP)
					{
						map[this.MapY[i]][this.MapX[i]] = EMPTY_BOX_MAP;		// 空箱のマップ
						// キノコを出現させる
						this.bKinoko = true;
						this.KinokoX = this.MapX[i] * 32;			// 壊れたブロックのX座標
						this.KinokoY  = this.MapY[i] * 32 - 32;	// 壊れたブロックのY座標
						this.KinokoAddX = 2;
						this.KinokoAddY = 0;
						this.KinokoMapY[0] = Math.floor(this.KinokoY / 32);			// 0-32で0,33-64で1(上)
						this.KinokoMapY[1] = Math.floor((this.KinokoY + 31) / 32);	// 0-32で0,33-64で1(下)
						this.KinokoMapY[2] = this.KinokoMapY[1];					// 0-32で0,33-64で1(下)
						this.KinokoMapY[3] = this.KinokoMapY[0];					// 0-32で0,33-64で1(上)
					}
					// コインのブロック
					else if(map[this.MapY[i]][this.MapX[i]] == COIN_MAP)
					{
						map[this.MapY[i]][this.MapX[i]] = EMPTY_BOX_MAP;		// 空箱のマップ
						// コインを表示させる
						this.bCoin[this.CoinIndex] = true;
						this.CoinX[this.CoinIndex] = this.MapX[i] * 32;
						this.CoinY[this.CoinIndex] = this.MapY[i] * 32 - 32;
						this.CoinCnt[this.CoinIndex] = 0;
						if(++this.CoinIndex >= MAX_COIN)this.CoinIndex = 0;		
						// 11.敵を上昇させるなどの処理
						{
							this.BlockUp(i,false);
						}
					}
				}
				this.bHeadCollision = true;		// 落とすようにフラグをたてる		
			}
			// キャラクターの下から当たっている
			else
			{
				// 地面とされる位置についた
				{
					this.PosY += Math.abs(this.Height + vecY);
					this.AddNumY = 0;
					if(this.bJump)
					{
						this.bJump = false;
						this.AnimX = 0;		// ジャンプモーションの解消
						this.JumpCnt = 0;	
					}
				}
			}
		}
		// フィールドのコインに触れた
		else if(map[this.MapY[i]][this.MapX[i]] == FCOIN_MAP)
		{
			map[this.MapY[i]][this.MapX[i]] = BACK_MAP;		// 背景色に変える
			if(this.CoinNum++ >= 100)this.Life++;				// 残機上昇
		}
	}
	
}

/*
	破壊されたブロックのアニメーション
*/
cMario.prototype.BlockAction = function(map){
	// ブロックのアニメーション
	for(var i = 0;i < MAX_BLOCK;++i){
		// ブロック破壊処理
		if(this.bBlockAtack[i])
		{
			for(var j = 0;j < 4;++j){
				this.BlockPosY[i][j] -= this.BlockAddY[i];
			}
			this.BlockAddY[i] -= 1;
			// 壊れたブロックのX座標(0,1は←側)
			this.BlockPosX[i][0] -= 4;
			this.BlockPosX[i][1] = this.BlockPosX[i][0];
			this.BlockPosX[i][2] += 4;
			this.BlockPosX[i][3] = this.BlockPosX[i][2];
			// 壊れたブロックのY座標(1,3は↑側)
			if(this.BlockPosY[i][3] <= -32)
			{
				this.bBlockAtack[i] = false;
			}
		}
		// ブロック上昇処理
		if(this.bBlockUp[i])
		{
			this.BlockAtackAddY[i] -= 1;		// 叩いたブロック上昇値
			// 上昇された座標が元に戻った
			if(this.BlockAtackAddY[i] == 0)
			{
				this.bBlockUp[i] = false;
			}
		}
	}
	// コインのアニメーション
	{
		for(var i = 0;i < MAX_COIN;++i){
			if(this.bCoin[i])
			{
				this.CoinY[i] -= 2;
				this.CoinCnt[i]++;
				if(++this.CoinCnt[i] >= 30)
				{
					this.CoinCnt[i] = 0;
					this.bCoin[i] = false;
				}
			}
		}
	}
	
	// キノコの動き
	if(this.bKinoko)
	{
		// キノコとキャラクターとの当たり判定
		{
			// 四角形で判定
			if(this.MoveNumX + 32 > this.KinokoX && this.MoveNumX < this.KinokoX + 32)
			{
				if(this.PosY + this.Height > this.KinokoY && this.PosY < this.KinokoY + 32)
				{
					this.bKinoko = false;
					// キノコが手に入っていない
					if(this.State != BIG)
					{
						this.State = BIG;		// キノコ状態
						this.IndexPoint = 6;	// 判定する頂点を増やす
						this.Height = 52;
						this.AnimY = 44;		// アニメーションY
						this.PosY -= 20;		// 描画量が増える分減算させる(32から52へ)
						this.DefineMapY(14);
					}
				}
			}
		}
		
		// 移動処理
		this.KinokoX += this.KinokoAddX;
		// マップ変数に移動後の座標を代入
		this.KinokoMapX[0] = Math.floor((this.KinokoX + 31) / 32);	// 0-32で0,33-64で1(右)
		this.KinokoMapX[1] = this.KinokoMapX[0];	//   右
		this.KinokoMapX[2] = Math.floor((this.KinokoX) / 32);	// 左
		this.KinokoMapX[3] = this.KinokoMapX[2];		// 左
		// 配列外(アイテムを消す)
		if(this.KinokoMapX[0] >= 100 || this.KinokoMapX[2] >= 100 || this.KinokoMapX[0] < 0 || this.KinokoMapY[2] < 0)
		{
			this.KinokoMapX[0] = this.KinokoMapX[1] = this.KinokoMapX[2] = this.KinokoMapX[3] = 0;
			this.bKinoko = false;		// 処理をやめる
		}
		// キャラクターの四隅にオブジェクトが触れているかをチェック
		for(var i = 0;i < 4;++i){
			// キャラクター四隅のいずれかがオブジェクトに触れた
			if(map[this.KinokoMapY[i]][this.KinokoMapX[i]] >= OBJECT_MAP)
			{
				// (加算される前の)中心点からの距離を見る
				var vecX = Math.abs((this.KinokoX + 16) - ((this.KinokoMapX[i] * 32) + 16));
				
				// X座標調整(右方向に移動)
				if(this.KinokoAddX > 0)
				{
					this.KinokoX = this.KinokoX - Math.abs(32 - vecX);
					this.KinokoAddX = -this.KinokoAddX;		// 逆方向に移動
				}
				else
				{
					this.KinokoX = this.KinokoX + Math.abs(32 - vecX);
					this.KinokoAddX = -this.KinokoAddX;		// 逆方向に移動
				}
				break;		// 一回当たり判定したら抜ける
			}
		}
		// マップ変数に移動後の座標を代入
		this.KinokoMapX[0] = Math.floor((this.KinokoX + 31) / 32);	// 0-32で0,33-64で1(右)
		this.KinokoMapX[1] = this.KinokoMapX[0];	//   右
		this.KinokoMapX[2] = Math.floor(this.KinokoX / 32);	// 左
		this.KinokoMapX[3] = this.KinokoMapX[2];		// 左
		
		// 配列外(アイテムを消す)
		if(this.KinokoMapX[0] >= 100 || this.KinokoMapX[2] >= 100 || this.KinokoMapX[0] < 0 || this.KinokoMapY[2] < 0)
		{
			this.KinokoMapX[0] = this.KinokoMapX[1] = this.KinokoMapX[2] = this.KinokoMapX[3] = 0;
			this.bKinoko = false;		// 処理をやめる
		}

		// 重力処理
		{

			this.KinokoAddY += 1;
			// 最大落下速度
			if(this.KinokoAddY < -MAX_GRAVITY) this.KinokoAddY = -MAX_GRAVITY;

			this.KinokoMapY[0] = Math.floor((this.KinokoY + this.KinokoAddY) / 32);			// 0-32で0,33-64で1(上)
			this.KinokoMapY[1] = Math.floor((this.KinokoY + this.KinokoAddY + 31) / 32);	// 0-32で0,33-64で1(下)
			this.KinokoMapY[2] = this.KinokoMapY[1];					// 0-32で0,33-64で1(下)
			this.KinokoMapY[3] = this.KinokoMapY[0];					// 0-32で0,33-64で1(上)
			// 配列外(アイテムを消す)
			if(this.KinokoMapY[0] > 14 || this.KinokoMapY[1] > 14 || this.KinokoMapY[0] < 0 || this.KinokoMapY[1] < 0)
			{
				this.KinokoMapY[0] = this.KinokoMapY[1] = this.KinokoMapY[2] = this.KinokoMapY[3] = 0;
				this.bKinoko = false;		// 処理をやめる
			}		
			// キャラクターの四隅にオブジェクトが触れているかをチェック
			for(var i = 0;i < 4;++i){
				// キャラクター四隅のいずれかがオブジェクトに触れた(上に上昇しないので、下だけみる)
				if(map[this.KinokoMapY[i]][this.KinokoMapX[i]] >= OBJECT_MAP)
			 	{
					
					// 距離を見る
		       		var vecY = ((this.KinokoY + 16) - ((this.KinokoMapY[i] * 32) + 16));     		
		       		// 上から当たっている
					if(vecY > 0)
					{
						// Yの加算量調整
						this.KinokoAddY = Math.abs(32 - vecY);
					}
					// 地面とされる位置についた
					else
					{
						this.KinokoY += Math.abs(32 + vecY);
						this.KinokoAddY = 0;
					}
				}
			}
			this.KinokoY += this.KinokoAddY;
			this.KinokoMapY[0] = Math.floor(this.KinokoY / 32);			// 0-32で0,33-64で1(上)
			this.KinokoMapY[1] = Math.floor((this.KinokoY + 31) / 32);	// 0-32で0,33-64で1(下)
			this.KinokoMapY[2] = this.KinokoMapY[1];					// 0-32で0,33-64で1(下)
			this.KinokoMapY[3] = this.KinokoMapY[0];					// 0-32で0,33-64で1(上)
			// 配列外(アイテムを消す)
			if(this.KinokoMapY[0] > 14 || this.KinokoMapY[1] > 14 || this.KinokoMapY[0] < 0 || this.KinokoMapY[1] < 0)
			{
				this.KinokoMapY[0] = this.KinokoMapY[1] = this.KinokoMapY[2] = this.KinokoMapY[3] = 0;
				this.bKinoko = false;		// 処理をやめる
			}
			
			// 11.ブロック上昇処理
			{		
				for(var i = 0;i < MAX_BLOCK;++i){
					// 叩いたブロックのY座標
					if(this.BlockAtackY[i] == this.KinokoY + 32)
					{
						// 叩いたブロックのX座標
						if(this.BlockAtackX[i] < this.KinokoX + 30  && this.BlockAtackX[i] + 30 > this.KinokoX)
						{
							this.KinokoAddY = -10;
						}
					}
				}
			}
		}
	}
}

/*
	敵と当たったときの処理
*/
cMario.prototype.EnemyCollision = function(map){
	if(this.State == BIG)
	{
		this.State = SMALL;
		this.Height = 32;
		this.IndexPoint = 4;
		this.AnimY = 0;		// アニメーションY
		//this.PosY += 22;		// 描画量が増える分減算させる
		this.PosY += 20;		// 描画量が増える分減算させる
		this.CollisionY(map,this.PosY);
		this.DefineMapY(14);	
		this.bInvincible = true;	// 無敵フラグ
		this.InvincibleTime = 0;	// 無敵時間
		
	}
	else
	{
		this.State = DEAD_ACTION;
		this.AddNumY = 14;
	}
}

/*
	下から叩かれたブロックを上昇させる処理
*/
cMario.prototype.BlockUp = function(i,bUp){
	this.BlockAtackX[this.BlockAtackIndex] = this.MapX[i] * 32;		// 叩いたブロックの効果X
	this.BlockAtackY[this.BlockAtackIndex] = this.MapY[i] * 32;		// 叩いたブロックの効果Y
	// ブロック上昇処理
	if(this.State == SMALL && bUp)
	{
		this.bBlockUp[this.BlockAtackIndex] = true;						// 叩いたブロックを上昇させるフラグ
		this.BlockAtackPosY[this.BlockAtackIndex] = this.BlockAtackY[this.BlockAtackIndex];		// 叩いたブロック位置Y
		this.BlockAtackAddY[this.BlockAtackIndex] = 8;		// 叩いたブロック上昇値
	}
	this.BlockAtackCnt[this.BlockAtackIndex]++;
	if(++this.BlockAtackIndex >= MAX_BLOCK)this.BlockAtackIndex = 0;	// 添え字戻す
}



