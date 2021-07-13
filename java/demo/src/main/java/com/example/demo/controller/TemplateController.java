package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequestMapping("/api")
public class TemplateController {

    @RequestMapping(value = "/testTemplate", method = RequestMethod.GET)
    public String testTemplate() {
        return "test";
    }
}
