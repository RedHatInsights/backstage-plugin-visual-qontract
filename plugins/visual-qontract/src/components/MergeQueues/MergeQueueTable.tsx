import { QueueTable } from "./QueueTable";
import { TableColumn, Link } from "@backstage/core-components";
import { PillList } from "../ChangelogFetchComponent/PillList";


export const MergeQueueTable = () => {

    const convertMinutesToHumanReadable = (minutesStr: string) => {
        const minutes = parseInt(minutesStr, 10);
    
        // Check if parsing was successful and the value is non-negative
        if (isNaN(minutes) || minutes < 0) {
            return 'Invalid input';
        }
    
        const days = Math.floor(minutes / 1440);
        const hours = Math.floor((minutes % 1440) / 60);
        const mins = Math.floor(minutes % 60);
    
        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (mins > 0 || parts.length === 0) parts.push(`${mins}m`); // Show minutes if zero or nothing else to show
    
        return parts.join(' ');
    };

    const columns: TableColumn[] = [
        {
          title: 'Title',
          field: 'title',
          render: (row: any) => {
            // Extract the display text and URL from markdown-style link format
            const match = row.id.match(/\[(.*?)\]\((.*?)\)/);
            const url = match ? match[2] : '#';
    
            return (
              <Link to={url} target="_blank" rel="noopener noreferrer">
                {row.title}
              </Link>
            );
          },
        },
        {
          title: 'Approved At',
          field: 'approved_at',
          render: (row: any) => {
            try {
              const date = new Date(row.approved_at);
              return new Intl.DateTimeFormat('default', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                timeZoneName: 'short',
              }).format(date);
            } catch (e) {
              return row.approved_at;
            }
          },
        },
        {
            title: 'Time to Approve',
            field: 'approved_span_minutes',
            render: (row: any) => {
                return convertMinutesToHumanReadable(row.approved_span_minutes)
            },
          },
        {
          title: 'Labels',
          field: 'labels',
          render: (row: any) => (
            <PillList
              items={row.labels.split(',')}
              field="label"
              onClick={() => {}}
              clickable={false}
              columns={columns}
            />
          ),
        },
      ];

    return (
        <QueueTable
            key="merge-queue"
            markdown="app-interface-merge-queue.md"
            title="Merge Queue"
            columns={columns}
        />
    );
}