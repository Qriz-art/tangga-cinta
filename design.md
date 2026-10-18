# Tangga Cinta
Indonesian two-player browser game. User reference: tactile green mini-game. Calm cream and sage layout with dimensional squares, illustrated snakes and ladders, coral and forest player tokens.
Palette: ivory #f7f7ed, forest #315d43, lime #d9e8a7, sage #a9bd84, blush #eeb4ad, ochre #dfbd68.
Typography: Fraunces headings and Poppins interface. Airy line heights, restrained borders and soft shadows.
Layout: top navigation, editorial title, large 8x8 board on left, player and dice controls on right. Mobile stacks board and controls.
Interactions: animated dice and movement; humorous/light cards on snakes and question squares; skip permitted; collection, rules, name editor and reset confirmation in modals.
Architecture: web only, localStorage game persistence, no auth, no new API or database. src/web/pages/index.tsx composes components/game.tsx, styles.css for visual system.
