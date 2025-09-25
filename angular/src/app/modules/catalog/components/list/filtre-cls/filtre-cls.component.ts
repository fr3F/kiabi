import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { ExampleFlatNode } from './filtre.model';
import { CLSHierrarchy } from '../../../models/cls-hierrarchy.model';
import { CatalogService } from '../../../services/catalog.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-filtre-cls',
  templateUrl: './filtre-cls.component.html',
  styleUrls: ['./filtre-cls.component.scss']
})
export class FiltreClsComponent implements OnInit {

  @Output() hierrarchyChanged = new EventEmitter();

  hierrarchies: CLSHierrarchy[];
  selectedHierrachy: CLSHierrarchy;

  private _transformer = (node: CLSHierrarchy, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.description,
      level: level,
      type: node.type,
      value: node.value,
      hierrarchy: node
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(
    this.treeControl, this.treeFlattener
  );

  constructor(
    private catalogService: CatalogService,
    private spinner: NgxSpinnerService
  ) {}

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
    this.initializeHierrachies();
  }

  initializeHierrachies() {
    this.spinner.show();
    this.catalogService.getCLSHierrarchies().subscribe(
      (r) => {
        this.spinner.hide();
        this.dataSource.data = r;
        this.hierrarchies = r;
      },
      this.catalogService.onError
    );
  }

  isActive(item: CLSHierrarchy) {
    if (!this.selectedHierrachy) return false;
    return item.value == this.selectedHierrachy.value && item.type == this.selectedHierrachy.type;
  }

  changeSelected(item: CLSHierrarchy) {
    this.selectedHierrachy = item;
    this.hierrarchyChanged.emit(this.selectedHierrachy);
  }

  onNodeToggle(node: ExampleFlatNode) {
    const parentNode = this.findParentNode(node);
    if (parentNode && !this.treeControl.isExpanded(parentNode)) {
      this.selectedHierrachy = null;
    }
  }

  findParentNode(node: ExampleFlatNode): ExampleFlatNode | null {
    let current = this.treeControl.dataNodes.find(n => n.value === node.value);
    if (current) {
      let parent = this.treeControl.dataNodes.find(n => n.level === current.level - 1 && n.expandable);
      return parent || null;
    }
    return null;
  }
}
