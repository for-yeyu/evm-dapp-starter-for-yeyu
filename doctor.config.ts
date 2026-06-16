export default {
  ignore: {
    rules: ['react/no-danger', 'jsx-a11y/no-autofocus'],
    files: ['src/ui/shadcn/**', 'src/lib/utils/shadcn/**'],
    overrides: [
      {
        files: ['package.json'],
        rules: ['deslop/unused-dependency'],
      },
      {
        files: ['components/modules/diff/**'],
        rules: ['react-doctor/no-array-index-as-key', 'react-doctor/no-render-in-render'],
      },
      {
        files: ['components/search/HighlightedSnippet.tsx'],
        rules: ['react/no-danger'],
      },
    ],
  },
}
