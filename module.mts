import { module } from '@prisma/composer';
import web from './hosting/service.mts';

export default module('powerful-purple-moose', ({ provision }) => {
  provision(web);
});
