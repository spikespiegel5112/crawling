package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HomeController {

    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public String test() {
        return "Hwllo World";
    }

    // @RequestMapping(value = "/testTemplate", method = RequestMethod.GET)
    // public String testTemplate() {
    //     return "test";
    // }

    @RequestMapping(value = "/testPost", method = RequestMethod.POST)
    public String testPost() {
        return "Hwllo testPost";
    }
}
