import {Component, OnInit} from '@angular/core';
import {TreatmentStateService} from "../core/services/treatment-state.service";
import {TreatmentService} from "../core/services/treatment.service";
import {FormBuilder, FormControl} from "@angular/forms";
import {Observable, tap} from "rxjs";
import {TreatmentDoneEvent} from "../shared/models/treatments/events";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styles: []
})
export class EditorComponent implements OnInit {
  editorCtrl!: FormControl;
  treatmentResult$!: Observable<TreatmentDoneEvent>;
  treatmentResult: string | null = null;
  canSendReq: boolean = true;

  constructor(private readonly treatmentStateService: TreatmentStateService,
              private readonly treatmentService: TreatmentService,
              private readonly fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.editorCtrl = this.fb.control('')
    this.treatmentResult$ = this.treatmentStateService.treatmentDone$.pipe(tap(_ => this.canSendReq = true))
    this.treatmentStateService.listenTreatmentDone();
    this.treatmentResult$.subscribe(res => {
      this.treatmentResult = res.result
    })
  }

  sendTreatmentReq() {
    this.canSendReq = false;
    this.treatmentService.create({content: this.editorCtrl.value})
      .subscribe(value => {
        this.treatmentResult = '';
        this.canSendReq = false
      }, error => this.canSendReq = true);
  }
}
