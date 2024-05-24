import {expect,test,describe} from "vitest";
import {register} from "../controllers/userController";
import { Request, Response } from 'express';

describe("[User Controller Tests]", () => {
    test("Should create a new User entity", () => {    
        const req = {
            body: {
                name: "Test",
                birthDate: "2000-01-01",
                login: "test",
                password: "test",
                email: "Joh@gamil.com",
                cpf: "12345678901"
            }
        } as Request;

        const res = {
            json: (data: any) => data,
            status: (code: number) => ({
                json: (data: any) => data
            })
        } as unknown as Response;

        register(req,res).then((user) => {
            expect(user).toBeInstanceOf(user);
        }
        
      );
    }
    );
    });