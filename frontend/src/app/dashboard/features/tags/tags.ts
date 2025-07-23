import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DashboardContentWrapper } from '../../dashboard-content-wrapper/dashboard-content-wrapper';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.html',
  styleUrl: './tags.css',
  imports: [DashboardContentWrapper, MatTableModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tags {
  protected readonly displayedColumns = signal([
    'id',
    'name',
    'description',
    'createdAt',
    'updatedAt',
  ]);
  protected readonly myDataArray = signal([
    {
      id: 1,
      name: 'Tag 1',
      description: 'Description 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Tag 2',
      description: 'Description 2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}
