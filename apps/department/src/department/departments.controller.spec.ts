import { Test, TestingModule } from '@nestjs/testing';
import { departmentController } from './modules/department/controllers/department.controller';
import { departmentService } from './interface/department.service';
describe('', () => {
  let depController: departmentController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [departmentController],
      providers: [departmentService],
    }).compile();

    depController = app.get<departmentController>(departmentController);
  });
  describe('root', () => {
    it('should return an array of departments', () => {
      const result = ['test'];
      expect(depController.getAll()).toBe(result);
    });
  });
});
