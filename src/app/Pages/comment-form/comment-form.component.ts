import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import DOMPurify from 'dompurify';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})

export class CommentFormComponent {
  @Input() parentId: number | null = null;
  @Input() userId: string | null = null;
  @Output() commentSubmitted = new EventEmitter<{ 
    content: string, 
    parentId: number | null, 
    userId: string,
    image?: File ,     
    textFile?: File   
  }>();
  isFileTooLarge = false;
  invalidFileType = false;
  selectedImage: File | null = null;
  selectedTextFile: File | null = null;
  commentForm: FormGroup;
  
  @ViewChild('quillEditor') quillEditorComponent!: QuillEditorComponent;

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'] 
    ],
  };

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required],
      parentId: [null]
    });
  }

  ngOnChanges() {
    this.commentForm.patchValue({ parentId: this.parentId });
  }
  
  validateXHTML(content: string): boolean {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'application/xhtml+xml');
      return !doc.querySelector('parsererror'); 
    } catch (error) {
      return false;
    }
  }

  onSubmit() {
    if (this.commentForm.valid && this.userId) {
      const content = this.commentForm.value.content;
      this.commentSubmitted.emit({
        content: content,
        parentId: this.parentId,
        userId: this.userId,
        image: this.selectedImage || undefined,  // Заменяем null на undefined
        textFile: this.selectedTextFile || undefined  // Заменяем null на undefined
      });

      this.commentForm.reset({ content: '', parentId: this.parentId });
      this.selectedImage = null;
      this.selectedTextFile = null;
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.validateAndProcessImage(file);
    }
    this.selectedImage = file;
  }

  validateAndProcessImage(file: File) {
    const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedFormats.includes(file.type)) {
      alert('Only JPG, GIF, and PNG formats are allowed.');
      this.invalidFileType = true;
      return;
    }
  }

  onTextFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.size > 102400) { 
      alert('Text file must be smaller than 100 KB.');
      this.isFileTooLarge = true;
      this.selectedTextFile = null;
      return;
    }
    this.isFileTooLarge = false;
    this.selectedTextFile = file;
  }
}
