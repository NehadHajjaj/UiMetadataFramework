import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { InputComponent } from "../input";
import { InputFieldMetadata } from "uimf-core/src";

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.css']
})
export class NumberComponent  {
  //@Input() model: InputFieldMetadata;
  //name = new FormControl();
  config;
  group: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
