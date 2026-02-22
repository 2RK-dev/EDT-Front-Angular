import {Component, Input, OnChanges, SimpleChanges, TemplateRef} from '@angular/core';
import {CommonModule} from '@angular/common';

export interface TableColumn {
  key: string;
  header: string;
  filterable?: boolean;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent<T> implements OnChanges {
  @Input() data: T[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() customTemplates: { [key: string]: TemplateRef<any> } = {};

  filteredData: T[] = [];

  filters: { [key: string]: string } = {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.applyFilters();
    }
  }

  onFilterChange(columnKey: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filters[columnKey] = inputElement.value.toLowerCase();
    this.applyFilters();
  }

  applyFilters() {
    this.filteredData = this.data.filter(item => {
      for (const key in this.filters) {
        const filterValue = this.filters[key];
        if (filterValue) {
          const itemValue = String((item as any)[key] || '').toLowerCase();
          if (!itemValue.includes(filterValue)) {
            return false;
          }
        }
      }
      return true;
    });
  }

  getRowValue(row: T, key: string): any {
    return (row as any)[key];
  }
}
