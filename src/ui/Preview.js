import React, { PropTypes } from 'react';
import Lowlight from 'react-lowlight';

const reqLangs = require.context(
  'highlight.js/lib/languages/',
  false,
  /.+\.js$/
); // Read all language files in the config dir
reqLangs.keys().forEach(lang => {
  try {
    const dep = reqLangs(lang);
    Lowlight.registerLanguage(lang, dep);
  } catch (err) {
    console.error('Could not register language: %s', lang);
    console.error(err);
  }
});

function Preview({ codeSnippet, theme }) {
  return (
    <div>
      <style>
        {theme}
      </style>
      <Lowlight value={codeSnippet} />
    </div>
  );
}

Preview.propTypes = {
  codeSnippet: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired
};

export default Preview;
