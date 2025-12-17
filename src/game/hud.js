import { SEGMENT } from './constants.js';

export function createHud(scene, { onTogglePause, onToggleMute } = {}) {
  const hudText = scene.add.text(14, 12, '', {
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    fontSize: '16px',
    color: '#d7f7ff'
  });
  hudText.setDepth(100);

  const helpText = scene.add.text(14, scene.scale.height - 52, '', {
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    fontSize: '14px',
    color: '#b9e7ff'
  });
  helpText.setDepth(100);

  const gameOverText = scene.add
    .text(scene.scale.width / 2, scene.scale.height / 2, '', {
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      fontSize: '28px',
      color: '#ffffff'
    })
    .setOrigin(0.5);
  gameOverText.setDepth(200);

  // Top-right controls (minimal).
  const btnY = 14;
  const pauseBtn = scene.add.rectangle(scene.scale.width - 88, btnY + 6, 34, 24, 0x062033, 0.35);
  pauseBtn.setOrigin(0.5);
  pauseBtn.setDepth(110);
  pauseBtn.setScrollFactor(0);
  pauseBtn.setInteractive({ useHandCursor: true });

  const pauseLabel = scene.add.text(pauseBtn.x, pauseBtn.y - 9, 'II', {
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    fontSize: '16px',
    color: '#d7f7ff'
  });
  pauseLabel.setOrigin(0.5);
  pauseLabel.setDepth(111);
  pauseLabel.setScrollFactor(0);

  const muteBtn = scene.add.rectangle(scene.scale.width - 40, btnY + 6, 34, 24, 0x062033, 0.35);
  muteBtn.setOrigin(0.5);
  muteBtn.setDepth(110);
  muteBtn.setScrollFactor(0);
  muteBtn.setInteractive({ useHandCursor: true });

  const muteLabel = scene.add.text(muteBtn.x, muteBtn.y - 8, 'S', {
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    fontSize: '14px',
    color: '#d7f7ff'
  });
  muteLabel.setOrigin(0.5);
  muteLabel.setDepth(111);
  muteLabel.setScrollFactor(0);

  pauseBtn.on('pointerdown', () => onTogglePause?.());
  muteBtn.on('pointerdown', () => onToggleMute?.());

  // Tutorial overlay (first-run).
  const tutorialDim = scene.add.rectangle(scene.scale.width / 2, scene.scale.height / 2, scene.scale.width, scene.scale.height, 0x000000, 0.42);
  tutorialDim.setDepth(180);
  tutorialDim.setScrollFactor(0);
  tutorialDim.setVisible(false);

  const tutorialText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2, '', {
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    fontSize: '18px',
    color: '#ffffff',
    align: 'center'
  });
  tutorialText.setOrigin(0.5);
  tutorialText.setDepth(181);
  tutorialText.setScrollFactor(0);
  tutorialText.setVisible(false);

  function setHelp(text) {
    helpText.setText(text);
  }

  function setPaused(paused) {
    pauseLabel.setText(paused ? '▶' : 'II');
  }

  function setMuted(muted) {
    muteLabel.setText(muted ? 'M' : 'S');
    muteBtn.setAlpha(muted ? 0.22 : 0.35);
  }

  function showTutorial(text) {
    tutorialText.setText(text);
    tutorialDim.setVisible(true);
    tutorialText.setVisible(true);
  }

  function hideTutorial() {
    tutorialDim.setVisible(false);
    tutorialText.setVisible(false);
  }

  function update({ hp, bombs, score, bestScore, segment, landing }) {
    hudText.setText(`HP: ${hp}   Bombs: ${bombs}   Score: ${score}   Best: ${bestScore}`);
    if (segment === SEGMENT.CARRIER_RETURN && !landing) helpText.setAlpha(1);
  }

  function showGameOver({ score, bestScore }) {
    gameOverText.setText(`GAME OVER\nScore: ${score}\nBest: ${bestScore}\n\nClick to restart`);
    setHelp('');
  }

  return {
    hudText,
    helpText,
    gameOverText,
    pauseBtn,
    muteBtn,
    setHelp,
    setPaused,
    setMuted,
    showTutorial,
    hideTutorial,
    update,
    showGameOver
  };
}
