import { Scene, Input } from 'phaser';
import { BY_ID } from '../data/roster';
import { Fighter, Hitbox } from '../systems/Fighter';
import { tickAI } from '../systems/EnemyAI';
import { playSpecial } from '../systems/Specials';
import { SPECIALS } from '../data/specials';

type FightInit = { playerId: string; opponentId: string; fightIndex: number };

type FightKeys = {
    A: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    W: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    F: Phaser.Input.Keyboard.Key;
    G: Phaser.Input.Keyboard.Key;
    SPACE: Phaser.Input.Keyboard.Key;
};

const ROUND_MS = 60_000;
const HP_BAR_W = 400;
const METER_BAR_W = 300;

export class Fight extends Scene
{
    private player!: Fighter;
    private enemy!: Fighter;
    private playerId!: string;
    private opponentId!: string;
    private fightIndex!: number;

    private playerHpBar!: Phaser.GameObjects.Rectangle;
    private enemyHpBar!: Phaser.GameObjects.Rectangle;
    private playerMeterBar!: Phaser.GameObjects.Rectangle;
    private enemyMeterBar!: Phaser.GameObjects.Rectangle;
    private timerText!: Phaser.GameObjects.Text;

    private keys!: FightKeys;
    private resolved = false;
    private started = false;
    private roundStartAt = 0;

    // Mic + speech demo
    private micAnalyser: AnalyserNode | null = null;
    private micBuf: Float32Array | null = null;
    private micBaseline = 0.02;
    private micCooldownUntil = 0;
    private micBar!: Phaser.GameObjects.Rectangle;
    private micLabel!: Phaser.GameObjects.Text;
    private speechRec: any = null;
    private speechHeard!: Phaser.GameObjects.Text;
    private speechCooldownUntil = 0;
    private speechStarted = false;

    // SFX (synthesised, no asset files)
    private sfxCtx: AudioContext | null = null;

    constructor ()
    {
        super('Fight');
    }

    init (data: FightInit)
    {
        this.playerId = data.playerId;
        this.opponentId = data.opponentId;
        this.fightIndex = data.fightIndex;
        this.resolved = false;
        this.started = false;
        this.roundStartAt = 0;
    }

    create ()
    {
        this.physics.world.setBounds(0, 0, 1024, 680);

        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a0d2e, 0x1a0d2e, 0x3a1d5e, 0x3a1d5e, 1);
        bg.fillRect(0, 0, 1024, 768);

        this.add.text(512, 410, 'PRIMER', {
            fontFamily: 'Arial Black', fontSize: 220, color: '#1f0d3c'
        }).setOrigin(0.5);

        for (let i = 0; i < 5; i++) {
            const wx = 112 + i * 200;
            const wy = 240;
            this.add.rectangle(wx, wy, 120, 90, 0x0d0820).setStrokeStyle(4, 0x4a3d7e);
            this.add.rectangle(wx, wy, 112, 84, 0x6644aa, 0.4);
            this.add.rectangle(wx, wy, 3, 84, 0x4a3d7e);
            this.add.rectangle(wx, wy, 112, 3, 0x4a3d7e);
            this.add.circle(wx + 30, wy - 20, 6, 0xffee88, 0.5);
        }

        this.add.text(512, 50, '— PRIMER OFFICE —', {
            fontFamily: 'Arial Black', fontSize: 22, color: '#8866cc'
        }).setOrigin(0.5);

        for (let i = 0; i < 3; i++) {
            const dx = 180 + i * 320;
            this.add.rectangle(dx, 658, 130, 18, 0x0e0820).setStrokeStyle(1, 0x33256b);
            this.add.rectangle(dx, 644, 60, 12, 0x222244).setStrokeStyle(1, 0x44336b);
        }

        this.add.rectangle(512, 700, 1024, 40, 0x0a0518);
        this.add.rectangle(512, 680, 1024, 3, 0x7755bb);

        const pData = BY_ID[this.playerId];
        const eData = BY_ID[this.opponentId];
        this.player = new Fighter(this, 250, 500, pData, 1);
        this.enemy = new Fighter(this, 774, 500, eData, -1);

        this.add.text(20, 80, pData.name + ' ' + pData.flag, {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff'
        });
        this.add.text(1004, 80, eData.name + ' ' + eData.flag, {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff'
        }).setOrigin(1, 0);

        this.add.rectangle(220, 115, HP_BAR_W, 22, 0x441111).setStrokeStyle(2, 0xffffff);
        this.playerHpBar = this.add.rectangle(20, 104, HP_BAR_W, 22, 0xff3333).setOrigin(0, 0);

        this.add.rectangle(804, 115, HP_BAR_W, 22, 0x441111).setStrokeStyle(2, 0xffffff);
        this.enemyHpBar = this.add.rectangle(1004, 104, HP_BAR_W, 22, 0xff3333).setOrigin(1, 0);

        this.add.rectangle(170, 142, METER_BAR_W, 10, 0x222200).setStrokeStyle(1, 0xffff00);
        this.playerMeterBar = this.add.rectangle(20, 137, 0, 10, 0xffff00).setOrigin(0, 0);

        this.add.rectangle(854, 142, METER_BAR_W, 10, 0x222200).setStrokeStyle(1, 0xffff00);
        this.enemyMeterBar = this.add.rectangle(1004, 137, 0, 10, 0xffff00).setOrigin(1, 0);

        this.drawBracket();

        this.timerText = this.add.text(512, 100, '60', {
            fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
            stroke: '#000', strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(20, 158, SPECIALS[pData.special].name + ' (SPACE or say "SPECIAL")', {
            fontFamily: 'Arial', fontSize: 12, color: '#ffff88'
        });
        this.add.text(1004, 158, SPECIALS[eData.special].name, {
            fontFamily: 'Arial', fontSize: 12, color: '#ffff88'
        }).setOrigin(1, 0);

        this.keys = this.input.keyboard!.addKeys('A,D,W,S,F,G,SPACE') as FightKeys;

        this.add.text(512, 750, 'A/D move • W jump • S block • F/G punch+kick • SPACE special — or use VOICE', {
            fontFamily: 'Arial', fontSize: 13, color: '#888888'
        }).setOrigin(0.5);

        // Voice command panel (top centre)
        this.add.rectangle(512, 210, 560, 90, 0x000000, 0.55)
            .setStrokeStyle(2, 0x553399, 0.9);
        this.add.text(512, 178, 'VOICE COMMANDS', {
            fontFamily: 'Arial Black', fontSize: 14, color: '#ffff88',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);
        this.add.text(232, 210, '"PUNCH"', { fontFamily: 'Arial Black', fontSize: 14, color: '#ffffff' }).setOrigin(0.5);
        this.add.text(232, 228, 'jab', { fontFamily: 'Arial', fontSize: 10, color: '#88ccff' }).setOrigin(0.5);
        this.add.text(392, 210, '"KICK"', { fontFamily: 'Arial Black', fontSize: 14, color: '#ffffff' }).setOrigin(0.5);
        this.add.text(392, 228, 'boot', { fontFamily: 'Arial', fontSize: 10, color: '#88ccff' }).setOrigin(0.5);
        this.add.text(552, 210, '"JUMP"', { fontFamily: 'Arial Black', fontSize: 14, color: '#ffffff' }).setOrigin(0.5);
        this.add.text(552, 228, 'up', { fontFamily: 'Arial', fontSize: 10, color: '#88ccff' }).setOrigin(0.5);
        this.add.text(712, 210, '"SPECIAL"', { fontFamily: 'Arial Black', fontSize: 14, color: '#ffffff' }).setOrigin(0.5);
        this.add.text(712, 228, 'super • finish', { fontFamily: 'Arial', fontSize: 10, color: '#88ccff' }).setOrigin(0.5);

        // Mic loudness meter (below the command panel)
        this.add.text(380, 268, 'MIC', {
            fontFamily: 'Arial', fontSize: 11, color: '#ffffff'
        }).setOrigin(0.5);
        this.add.rectangle(512, 268, 200, 10, 0x000000, 0.5)
            .setStrokeStyle(1, 0xffffff, 0.6);
        this.micBar = this.add.rectangle(412, 268, 0, 10, 0x4ade80).setOrigin(0, 0.5);
        this.micLabel = this.add.text(644, 268, 'starting mic…', {
            fontFamily: 'Arial', fontSize: 10, color: '#ffeb3b'
        }).setOrigin(0, 0.5);
        this.speechHeard = this.add.text(512, 288, 'heard: —', {
            fontFamily: 'Arial', fontSize: 11, color: '#88ccff'
        }).setOrigin(0.5);

        const tryStart = (src: string) => {
            console.log('[voice] tryStart from:', src, 'alreadyStarted=', this.speechStarted);
            if (this.speechStarted) return;
            this.speechStarted = true;
            this.startMic();
            this.startSpeech();
        };
        console.log('[voice] Fight.create — attempting immediate start');
        console.log('[voice] secureContext=', window.isSecureContext, 'origin=', window.location.origin);
        console.log('[voice] mediaDevices=', !!navigator.mediaDevices, 'getUserMedia=', !!navigator.mediaDevices?.getUserMedia);
        console.log('[voice] SpeechRecognition=', !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition);
        tryStart('immediate');
        this.input.keyboard!.once('keydown', () => tryStart('keydown'));
        this.input.once('pointerdown', () => tryStart('pointerdown'));

        this.events.once('shutdown', () => {
            const ctx = this.micAnalyser?.context as AudioContext | undefined;
            ctx?.close();
            this.micAnalyser = null;
            try { this.speechRec?.stop(); } catch {}
            this.speechRec = null;
        });

        this.showCountdown();
    }

    private drawBracket (): void
    {
        const labels = ['R1', 'PE', 'GAB'];
        labels.forEach((label, i) => {
            const cx = 412 + i * 100;
            const cy = 22;
            const isPast = (i + 1) < this.fightIndex;
            const isCurrent = (i + 1) === this.fightIndex;
            const fill = isPast || isCurrent ? 0xffff00 : 0x222244;
            const stroke = isCurrent ? 0xffffff : 0x555577;
            this.add.circle(cx, cy, 14, fill).setStrokeStyle(2, stroke);
            this.add.text(cx, cy, label, {
                fontFamily: 'Arial Black', fontSize: 11,
                color: isPast || isCurrent ? '#000000' : '#ffffff'
            }).setOrigin(0.5);
            if (i < labels.length - 1) {
                this.add.rectangle(cx + 50, cy, 70, 2, isPast ? 0xffff00 : 0x444466);
            }
        });
    }

    private async startMic ()
    {
        console.log('[voice] startMic — calling getUserMedia');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false }
            });
            console.log('[voice] getUserMedia OK — tracks:', stream.getAudioTracks().map(t => ({ label: t.label, enabled: t.enabled, muted: t.muted })));
            const ctx = new AudioContext();
            console.log('[voice] AudioContext state=', ctx.state, 'sampleRate=', ctx.sampleRate);
            if (ctx.state === 'suspended') {
                await ctx.resume();
                console.log('[voice] AudioContext resumed -> state=', ctx.state);
            }
            const src = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 1024;
            analyser.smoothingTimeConstant = 0.2;
            src.connect(analyser);
            this.micAnalyser = analyser;
            this.micBuf = new Float32Array(analyser.fftSize);
            this.micLabel.setText('listening — yell to shake');
            this.micLabel.setColor('#4ade80');
            console.log('[voice] mic pipeline ready');
        } catch (e: any) {
            console.error('[voice] startMic FAILED:', e?.name, e?.message, e);
            this.speechStarted = false;
            this.micLabel.setText(`mic: ${e?.name || 'denied'} — click to retry`);
            this.micLabel.setColor('#ef4444');
        }
    }

    private startSpeech ()
    {
        console.log('[voice] startSpeech');
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) {
            console.warn('[voice] SpeechRecognition not in window');
            this.speechHeard.setText('speech: unsupported (use Chrome)');
            this.speechHeard.setColor('#ef4444');
            return;
        }
        const rec = new SR();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';
        rec.onstart = () => console.log('[voice] speech onstart');
        rec.onaudiostart = () => console.log('[voice] speech onaudiostart');
        rec.onspeechstart = () => console.log('[voice] speech onspeechstart');
        rec.onspeechend = () => console.log('[voice] speech onspeechend');
        rec.onresult = (e: any) => {
            const last = e.results[e.results.length - 1];
            const text = String(last[0].transcript).toLowerCase().trim();
            console.log('[voice] speech result:', text, 'isFinal=', last.isFinal);
            this.speechHeard.setText(`heard: ${text.slice(-40)}`);
            this.handleSpeech(text);
        };
        rec.onerror = (e: any) => {
            console.error('[voice] speech onerror:', e.error, e.message);
            this.speechHeard.setText(`speech err: ${e.error}`);
        };
        rec.onend = () => {
            console.log('[voice] speech onend — restarting');
            try { rec.start(); } catch (err) { console.warn('[voice] speech restart failed:', err); }
        };
        try {
            rec.start();
            this.speechRec = rec;
            console.log('[voice] speech.start() called');
        } catch (err: any) {
            console.error('[voice] speech.start() threw:', err?.name, err?.message);
            this.speechHeard.setText('speech: failed to start');
        }
    }

    private tickMic (now: number)
    {
        if (!this.micAnalyser || !this.micBuf) return;
        this.micAnalyser.getFloatTimeDomainData(this.micBuf);

        let sum = 0;
        for (let i = 0; i < this.micBuf.length; i++) sum += this.micBuf[i] * this.micBuf[i];
        const rms = Math.sqrt(sum / this.micBuf.length);

        this.micBaseline = this.micBaseline * 0.995 + rms * 0.005;
        const threshold = Math.max(0.08, this.micBaseline * 6);

        const visual = Math.min(1, rms * 4);
        this.micBar.width = visual * 200;
        this.micBar.fillColor = rms > threshold ? 0xef4444 : 0x4ade80;

        if (rms > threshold && now > this.micCooldownUntil) {
            this.micCooldownUntil = now + 250;
            this.cameras.main.shake(120, 0.008);
        }
    }

    private handleSpeech (text: string)
    {
        if (this.resolved || !this.player?.isAlive() || !this.started) return;
        const now = this.time.now;
        if (now < this.speechCooldownUntil) return;

        if (/\b(jump|up)\b/.test(text)) {
            this.player.jump();
            this.sfxJump();
            this.speechCooldownUntil = now + 350;
        } else if (/\b(punch|hit|jab)\b/.test(text)) {
            const hb = this.player.punch();
            if (hb) this.spawnHitbox(hb, this.player, this.enemy);
            this.sfxPunch();
            this.speechCooldownUntil = now + 350;
        } else if (/\b(kick|boot)\b/.test(text)) {
            const hb = this.player.kick();
            if (hb) this.spawnHitbox(hb, this.player, this.enemy);
            this.sfxKick();
            this.speechCooldownUntil = now + 350;
        } else if (/\b(special|super|finish)\b/.test(text)) {
            if (this.player.startSpecial()) {
                playSpecial(this, this.player, this.enemy);
                this.player.incrementCombo();
                this.sfxSpecial();
            }
            this.speechCooldownUntil = now + 600;
        }
    }

    // ───── Procedural SFX (Web Audio, no asset files) ─────

    private ensureSfxCtx (): AudioContext {
        if (!this.sfxCtx) this.sfxCtx = new AudioContext();
        if (this.sfxCtx.state === 'suspended') this.sfxCtx.resume();
        return this.sfxCtx;
    }

    private playTone (type: OscillatorType, freqStart: number, freqEnd: number, duration: number, volume = 0.25) {
        const ctx = this.ensureSfxCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 0.01), ctx.currentTime + duration);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    }

    private playNoise (duration: number, volume = 0.3, lowpass = 1200) {
        const ctx = this.ensureSfxCtx();
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = lowpass;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        noise.connect(filter).connect(gain).connect(ctx.destination);
        noise.start();
        noise.stop(ctx.currentTime + duration);
    }

    private sfxPunch () { this.playTone('square', 220, 60, 0.12, 0.22); this.playNoise(0.08, 0.18, 900); }
    private sfxKick ()  { this.playTone('sawtooth', 160, 40, 0.18, 0.28); this.playNoise(0.12, 0.22, 600); }
    private sfxJump ()  { this.playTone('square', 320, 720, 0.16, 0.18); }
    private sfxHit ()   { this.playNoise(0.12, 0.35, 1800); this.playTone('triangle', 500, 120, 0.14, 0.18); }
    private sfxSpecial () {
        this.playTone('sawtooth', 200, 800, 0.18, 0.22);
        setTimeout(() => this.playTone('square', 600, 1200, 0.22, 0.2), 120);
        setTimeout(() => this.playNoise(0.3, 0.2, 2400), 200);
    }
    private sfxWin ()  { this.playTone('triangle', 440, 880, 0.15, 0.22); setTimeout(() => this.playTone('triangle', 660, 1320, 0.25, 0.22), 140); }
    private sfxLose () { this.playTone('sawtooth', 320, 60, 0.6, 0.24); }

    private showCountdown ()
    {
        this.showSplash(() => this.showThreeTwoOne());
    }

    private showSplash (then: () => void)
    {
        const round = this.fightIndex === 1
            ? 'ROUND 1'
            : this.fightIndex === 2 ? 'SEMI-FINAL' : 'FINAL';
        const opp = BY_ID[this.opponentId];

        const r = this.add.text(512, 360, round, {
            fontFamily: 'Arial Black', fontSize: 64,
            color: this.fightIndex === 3 ? '#ff3333' : '#ffff00',
            stroke: '#000000', strokeThickness: 10
        }).setOrigin(0.5).setAlpha(0).setDepth(100);

        const vs = this.add.text(512, 440, 'VS  ' + opp.name + '  ' + opp.flag, {
            fontFamily: 'Arial Black', fontSize: 50, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5).setAlpha(0).setDepth(100);

        this.tweens.add({ targets: [r, vs], alpha: 1, duration: 240, ease: 'Cubic.easeOut' });
        this.time.delayedCall(1150, () => {
            this.tweens.add({
                targets: [r, vs], alpha: 0, duration: 260,
                onComplete: () => { r.destroy(); vs.destroy(); then(); }
            });
        });
    }

    private showThreeTwoOne ()
    {
        const steps: { label: string; color: string; big: boolean }[] = [
            { label: '3',      color: '#ffffff', big: false },
            { label: '2',      color: '#ffffff', big: false },
            { label: '1',      color: '#ffffff', big: false },
            { label: 'FIGHT!', color: '#ffff00', big: true },
        ];
        let i = 0;
        const next = () => {
            if (i >= steps.length) {
                this.started = true;
                this.roundStartAt = this.time.now;
                return;
            }
            const step = steps[i];
            const text = this.add.text(512, 440, step.label, {
                fontFamily: 'Arial Black', fontSize: step.big ? 140 : 130,
                color: step.color, stroke: '#000000', strokeThickness: 10
            }).setOrigin(0.5).setScale(0.3).setAlpha(0).setDepth(100);

            this.tweens.add({
                targets: text, scale: 1, alpha: 1, duration: 180, ease: 'Back.easeOut',
                onComplete: () => {
                    this.tweens.add({
                        targets: text, alpha: 0, scale: step.big ? 2 : 1.5,
                        duration: 320, delay: 120,
                        onComplete: () => { text.destroy(); i++; next(); }
                    });
                }
            });
        };
        next();
    }

    update (t: number)
    {
        if (!this.player || !this.enemy) return;

        if (this.player.sprite.x < this.enemy.sprite.x) {
            this.player.facing = 1;
            this.enemy.facing = -1;
        } else {
            this.player.facing = -1;
            this.enemy.facing = 1;
        }

        this.updateHud(t);

        if (!this.started) {
            this.player.update();
            this.enemy.update();
            this.tickMic(t);
            return;
        }

        if (!this.resolved) {
            const remaining = ROUND_MS - (t - this.roundStartAt);
            if (remaining <= 0) {
                this.resolveTimeUp();
            }
        }

        this.player.blocking = !this.resolved
            && this.keys.S.isDown
            && this.player.isAlive();

        if (!this.resolved && this.player.isAlive() && !this.player.blocking) {
            if (this.keys.A.isDown) this.player.moveLeft();
            else if (this.keys.D.isDown) this.player.moveRight();
            else this.player.stopMove();

            if (Input.Keyboard.JustDown(this.keys.W)) { this.player.jump(); this.sfxJump(); }

            if (Input.Keyboard.JustDown(this.keys.F)) {
                const hb = this.player.punch();
                if (hb) { this.spawnHitbox(hb, this.player, this.enemy); this.sfxPunch(); }
            }
            if (Input.Keyboard.JustDown(this.keys.G)) {
                const hb = this.player.kick();
                if (hb) { this.spawnHitbox(hb, this.player, this.enemy); this.sfxKick(); }
            }
            if (Input.Keyboard.JustDown(this.keys.SPACE)) {
                if (this.player.startSpecial()) {
                    playSpecial(this, this.player, this.enemy);
                    this.player.incrementCombo();
                    this.sfxSpecial();
                }
            }
        } else if (this.player.blocking) {
            this.player.stopMove();
        }

        if (!this.resolved && this.enemy.isAlive()) {
            const ai = tickAI(this.enemy, this.player, t);
            if (ai.hitbox) this.spawnHitbox(ai.hitbox, this.enemy, this.player);
            if (ai.specialTriggered) {
                playSpecial(this, this.enemy, this.player);
                this.enemy.incrementCombo();
            }
        }

        this.player.update();
        this.enemy.update();
        this.tickMic(t);

        if (!this.resolved && (!this.player.isAlive() || !this.enemy.isAlive())) {
            this.resolveKo();
        }
    }

    private updateHud (t: number): void
    {
        const playerHpTarget = (this.player.health / 100) * HP_BAR_W;
        const enemyHpTarget = (this.enemy.health / 100) * HP_BAR_W;
        this.playerHpBar.width += (playerHpTarget - this.playerHpBar.width) * 0.18;
        this.enemyHpBar.width += (enemyHpTarget - this.enemyHpBar.width) * 0.18;

        const lowP = this.player.health <= 25 && this.player.isAlive();
        const lowE = this.enemy.health <= 25 && this.enemy.isAlive();
        this.playerHpBar.alpha = lowP ? 0.55 + Math.sin(t * 0.014) * 0.4 : 1;
        this.enemyHpBar.alpha = lowE ? 0.55 + Math.sin(t * 0.014) * 0.4 : 1;
        this.playerHpBar.fillColor = lowP ? 0xff5555 : 0xff3333;
        this.enemyHpBar.fillColor = lowE ? 0xff5555 : 0xff3333;

        this.playerMeterBar.width = (this.player.meter / 100) * METER_BAR_W;
        this.enemyMeterBar.width = (this.enemy.meter / 100) * METER_BAR_W;

        if (this.started && !this.resolved) {
            const remaining = Math.max(0, ROUND_MS - (t - this.roundStartAt));
            const sec = Math.ceil(remaining / 1000);
            this.timerText.setText(sec.toString());
            this.timerText.setColor(sec <= 10 ? '#ff3333' : '#ffffff');
        } else if (!this.started) {
            this.timerText.setText('60');
            this.timerText.setColor('#ffffff');
        }
    }

    private resolveKo (): void
    {
        this.resolved = true;
        const winnerId = this.player.isAlive() ? this.player.data.id : this.enemy.data.id;
        const loserId = this.player.isAlive() ? this.enemy.data.id : this.player.data.id;
        const playerWon = winnerId === this.playerId;

        if (playerWon) this.sfxWin(); else this.sfxLose();

        this.add.text(512, 360, playerWon ? 'K.O.' : 'YOU LOST', {
            fontFamily: 'Arial Black', fontSize: 80,
            color: playerWon ? '#ffff00' : '#ff3333',
            stroke: '#000', strokeThickness: 8
        }).setOrigin(0.5).setDepth(80);

        this.time.delayedCall(1700, () => {
            this.scene.start('Result', {
                winnerId, loserId,
                fightIndex: this.fightIndex,
                playerId: this.playerId
            });
        });
    }

    private resolveTimeUp (): void
    {
        this.resolved = true;
        const playerWon = this.player.health >= this.enemy.health;
        const winnerId = playerWon ? this.playerId : this.enemy.data.id;
        const loserId = playerWon ? this.enemy.data.id : this.playerId;

        if (playerWon) this.sfxWin(); else this.sfxLose();

        this.add.text(512, 320, 'TIME UP', {
            fontFamily: 'Arial Black', fontSize: 70, color: '#ffaa22',
            stroke: '#000', strokeThickness: 8
        }).setOrigin(0.5).setDepth(80);
        this.add.text(512, 400, playerWon ? 'You had more HP — you win!' : 'You had less HP — you lose!', {
            fontFamily: 'Arial Black', fontSize: 24,
            color: playerWon ? '#ffff00' : '#ff3333',
            stroke: '#000', strokeThickness: 5
        }).setOrigin(0.5).setDepth(80);

        this.time.delayedCall(1700, () => {
            this.scene.start('Result', {
                winnerId, loserId,
                fightIndex: this.fightIndex,
                playerId: this.playerId
            });
        });
    }

    private spawnHitbox (hb: Hitbox, attacker: Fighter, defender: Fighter): void
    {
        const rect = this.add.rectangle(hb.x, hb.y, hb.w, hb.h, 0xffff00, 0.18).setVisible(false);
        let landed = false;
        const tick = () => {
            if (landed) return;
            const dx = Math.abs(rect.x - defender.sprite.x);
            const dy = Math.abs(rect.y - defender.sprite.y);
            if (defender.isAlive() && dx < (hb.w / 2 + 40) && dy < (hb.h / 2 + 80)) {
                defender.takeHit(hb.damage);
                attacker.addMeter(20);
                attacker.incrementCombo();
                this.sfxHit();
                landed = true;
                rect.destroy();
            }
        };
        const interval = this.time.addEvent({ delay: 30, loop: true, callback: tick });
        this.time.delayedCall(hb.durationMs, () => {
            interval.remove();
            if (!landed) rect.destroy();
        });
    }
}
