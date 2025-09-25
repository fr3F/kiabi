import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable,  of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {

  @Input() ngClass = "";
  @Input() model: any;  
  @Input() selectOnly: boolean = false;  
  @Output() change = new EventEmitter();
 
  @Input() placeholder = "Rechercher"
  @Input() replace = true;
  @Input() exists: string[] = [];

  @Input() url = "";
  urlSearch;
  constructor(
    private http: HttpClient
  ) { }

  tableauDeStrings = ['Première chaîne', 'Deuxième chaîne', 'Troisième chaîne'];


  results$: Observable<string[]>;

  ngOnInit(): void {
  }

  // search(){
  //   if(!this.selectOnly)
  //     this.change.emit(this.model);
  //   else  
  //     this.change.emit("");
  //   this.results$ = this.http.get<string[]>(this.urlSearch, {params: {search: this.model}})
  // }

  search(){
    this.urlSearch = environment.apiUrl + this.url;
    if(!this.selectOnly)
      this.change.emit(this.model);
    else  
      this.change.emit("");
    this.results$ = this.http.get<string[]>(this.urlSearch, {params: {search: this.model}}).pipe(
      map(
        (r)=> r.filter((r)=> this.exists.indexOf(r) == -1)
      )
    );
  }
  
  onChange(){
    // if(this.selectOnly){
    //   this.change.emit(this.model);
    //   this.results$ = this.http.get<string[]>(this.urlSearch, {params: {search: this.model}})
    // }
  }

  // select(item){
  //   this.model = item;
  //   this.change.emit(item);
  //   this.results$ = of([]);
  // }
  select(item){
    if(this.replace){
      this.model = item;
      this.results$ = of([]);
    }
    else
      this.search();
    this.change.emit(item);
  }


}
