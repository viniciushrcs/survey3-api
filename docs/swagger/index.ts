import paths from './paths';
import schemas from './schemas';
import components from './components';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Survey3 Api',
    description: 'Api to manage surveys',
    version: '1.0.0',
    contact: {
      name: 'Vinícius Chagas',
      email: 'viniciushrcs@gmail.com',
      url: 'https://www.linkedin.com/in/viniciushenriquechagas'
    },
    license: {
      name: 'GPL-3.0-or-later',
      url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
    }
  },
  externalDocs: {
    description: 'Project on github',
    url: 'https://github.com/viniciushrcs/survey3-api'
  },
  servers: [
    {
      url: '/api',
      description: 'Main route'
    }
  ],
  tags: [
    {
      name: 'Login',
      description: 'Login routes'
    },
    {
      name: 'Survey',
      description: 'Survey routes'
    }
  ],
  paths,
  schemas,
  components
};
