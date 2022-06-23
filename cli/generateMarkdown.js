function generateMarkdown(answers) {
  return `
  ## Title
  ${answers.Title}
  
  ## Description
  ${answers.Description}
  
  `;
}

module.exports = {generateMarkdown};
