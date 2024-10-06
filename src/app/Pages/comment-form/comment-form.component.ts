import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css'
})

export class CommentFormComponent {
  @Input() parentId: number | null = null;
  @Input() userId: string | null = null;
  @Output() commentSubmitted = new EventEmitter<{ content: string, parentId: number | null, userId: string }>();
  commentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required],
      parentId: [null]
    });
  }

  ngOnChanges() {
    this.commentForm.patchValue({ parentId: this.parentId });
  }

  onSubmit() {
    if (this.commentForm.valid && this.userId) {
      this.commentSubmitted.emit({
        content: this.commentForm.value.content,
        parentId: this.parentId,
        userId: this.userId
      });
      this.commentForm.reset({ content: '', parentId: this.parentId });
    }
  }
}