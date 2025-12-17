import { SEGMENT } from './constants.js';

export function createHud(scene) {
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

  function setHelp(text) {
    helpText.setText(text);
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
    setHelp,
    update,
    showGameOver
  };
}
