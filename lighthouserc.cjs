module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 2,
      settings: {
        chromeFlags: '--no-sandbox'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.65 }],
        'categories:accessibility': ['error', { minScore: 0.90 }],
        'categories:best-practices': ['error', { minScore: 0.85 }],
        'categories:seo': ['error', { minScore: 0.90 }]
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci'
    }
  }
};
