/**
 * Commu Design Tokens
 * 디자인 토큰을 TypeScript에서 사용할 수 있도록 export
 */

import designTokens from './design-tokens.json';

export const tokens = designTokens;

// 색상 토큰
export const colors = designTokens.colors;
export const primaryColors = designTokens.colors.primary;
export const secondaryColors = designTokens.colors.secondary;
export const accentColors = designTokens.colors.accent;
export const grayColors = designTokens.colors.gray;
export const semanticColors = designTokens.colors.semantic;

// 타이포그래피 토큰
export const typography = designTokens.typography;
export const fontFamily = designTokens.typography.fontFamily;
export const fontSize = designTokens.typography.fontSize;
export const fontWeight = designTokens.typography.fontWeight;
export const lineHeight = designTokens.typography.lineHeight;
export const typographyPresets = designTokens.typography.presets;

// 간격 토큰
export const spacing = designTokens.spacing;
export const spacingScale = designTokens.spacing.scale;
export const spacingSemantic = designTokens.spacing.semantic;

// 테두리 반경 토큰
export const borderRadius = designTokens.borderRadius;

// 그림자 토큰
export const shadows = designTokens.shadows;

// 애니메이션 토큰
export const animation = designTokens.animation;
export const animationDuration = designTokens.animation.duration;
export const animationEasing = designTokens.animation.easing;

// z-index 토큰
export const zIndex = designTokens.zIndex;

// 브레이크포인트 토큰
export const breakpoints = designTokens.breakpoints;

export default tokens;
