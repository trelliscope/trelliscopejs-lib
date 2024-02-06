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
        name: 'test',
        message: 'Will this component have playwright tests?',
      },
    ];

    return inquirer.prompt(questions).then((answers) => {
      const { name } = answers;
      answers.name = name.charAt(0).toUpperCase() + name.slice(1);
      return answers;
    });
  },
};
