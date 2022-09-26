module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'What is the component name?',
      },
      {
        type: 'confirm',
        name: 'unitTest',
        message: 'Will this component have unit tests?',
      },
    ];

    return inquirer.prompt(questions).then((answers) => {
      const { name } = answers;
      if (name.charAt(0) !== name.charAt(0).toUpperCase()) {
        throw new Error('Component name must start with a capital letter');
      }
      return answers;
    });
  },
};
