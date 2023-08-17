import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { from } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  userForm: FormGroup;
  submittedData: any[] = [];
  valuePlace: number = 0;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  submitForm() {
    if (this.userForm.valid) {
      const formData = this.userForm.value;

      this.saveUserData(formData)
        .pipe(
          map(response => ({ ...formData, index: this.valuePlace++ })),
          filter(modifiedData => {
            if (this.valuePlace % 2 === 0) {
              modifiedData.name = 'John';
            }
            return true;
          }),
          tap(modifiedData => {
            this.submittedData.push(modifiedData);
            this.userForm.reset();
            console.log("Submitted Data: ", this.submittedData);
          }),
          catchError(error => {
            console.error("Error submitting data:", error);
            return throwError(() => new Error('test'));
          })
        )
        .subscribe();
    }
  }

  saveUserData(formData: any) {
    return from(new Promise(resolve => {
      setTimeout(() => {
        resolve('Data saved successfully');
      }, 1000);
    }));
  }
}





//FOR SubmitForm()

// Validation Check: Before proceeding with anything, the function checks whether the userForm is valid. If it's not valid (i.e., if the user has not entered valid data), the function won't proceed further.

// Form Data Retrieval: If the form is valid, the function extracts the form data using this.userForm.value.

// Observable Processing: The saveUserData function returns an observable that represents an asynchronous operation. The function uses RxJS's pipe operator to chain a series of operators for processing the emitted data.

// Map Operator: The map operator takes the response emitted by the saveUserData observable and transforms it. In this case, it creates a new object by spreading the formData and adding an index property with the value of this.valuePlace++, which increments valuePlace for each new submission.

// Tap Operator: The tap operator allows you to perform side effects on the emitted values without modifying them. Here, it's used to push the modified data into the submittedData array, reset the form fields, and log the submitted data.

// Catch Error Operator: The catchError operator handles errors that might occur during the observable chain's execution. If there's an error during submission, it logs the error and re-throws it to maintain the observable chain.

// Subscribe: The subscribe method is called to start the execution of the observable chain. Since the focus of this code is on using observables for processing and handling asynchronous tasks, there's no need to provide arguments to subscribe because the results are handled by the tap and catchError operators.

// Overall, this code demonstrates how observables and RxJS operators can be used to handle asynchronous operations, modify data, and manage side effects in a structured manner


// DEFINTIONS 

// Observables: Observables are a core concept in reactive programming. They represent a stream of values over time that can be observed by interested parties. An Observable emits data items, and interested parties (subscribers) can subscribe to it to receive and react to those emitted values. Observables can represent asynchronous data sources, such as events, HTTP requests, or any data that changes over time.

// Map: The map operator is commonly used in observables to transform emitted values into new values using a provided function. It applies the provided function to each emitted value, returning a new value. In the context of observables, the map operator allows you to transform the data emitted by the observable before passing it on to the next operator in the chain.

// Pipe: The pipe function in RxJS is used to compose multiple operators into a single operator. It takes one or more operator functions as arguments and creates a new observable by chaining them together. This allows you to build complex data manipulation flows by sequentially applying a series of operators to the emitted values of an observable.

// Tap: The tap operator is used to perform side effects (actions that don't change the emitted data) on the emitted values of an observable. It is often used for logging, updating external state, or triggering actions based on the emitted values. The tap operator doesn't modify the emitted values but allows you to take actions based on those values without affecting the observable chain.