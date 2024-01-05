# ↬ Node nvm-switcher

Automatically switch node versions through nvm based on package.json recommended engine version.

## How to install

- First of all, make sure you have `NVM` installed:
  - Windows: [nvm-windows repo](https://github.com/coreybutler/nvm-windows)
  - Linux/Mac: [nvm repo](https://github.com/nvm-sh/nvm)
- Clone this repository for any folder you'd like:
  - `git clone https://github.com/Nick-Gabe/nvm-switcher.git`
- Install the code in your shell:
  - Check what is the configuration file of your shell, for example `.zshrc`, `.bashrc`, `$profile`...
  - Add the following line to the end of it: `nvm use \$(node <directory>/nvm-switcher)`
  - Replace `<directory>` by the directory the repository is in.

After all those steps, once you open a shell, it will automatically execute the `nvm-switcher` command and find the optimal version for you.

### Want to contribute?

- Fork the repo [here](https://github.com/Nick-Gabe/nvm-switcher/fork)
- Clone it:

```shell
git clone https://github.com/<user>/nvm-switcher.git
# replace <user> with your username
```

- Do the changes and updates, push them to your repository
- Create a Pull Request [here](https://github.com/Nick-Gabe/nvm-switcher/compare)!

## Why make the code in Javascript?

Since we're talking about node versions, you should already have node in your system,
therefore using `javascript` provides a more understandable code and easier API than
`bash` for example.

But this might change at some point, due to `javascript` not being the most optimal
language in terms of speed for this kind of operation which requires running terminal commands.
