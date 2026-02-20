import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable, DataTableFilterMeta, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import { Slider } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { CustomerService } from './service/CustomerService';

interface Country {
    name: string;
    code: string;
}

interface Representative {
    name: string;
    image: string;
}

interface Customer {
    id: number;
    name: string;
    country: Country;
    company: string;
    date: string | Date;
    status: string;
    verified: boolean;
    activity: number;
    representative: Representative;
    balance: number;
}

export default function CustomersDemo() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(12239); // 👈 total count
    const [first, setFirst] = useState<number>(0);
    const [rows, setRows] = useState<number>(12);

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
    });

    useEffect(() => {
        loadCustomers(0, rows);
    }, []);

    const loadCustomers = (start: number, limit: number) => {
        CustomerService.getCustomersLarge().then((data: Customer[]) => {
            const updated = data.map((d) => ({
                ...d,
                date: new Date(d.date)
            }));

            const pagedData = updated.slice(start, start + limit);
            setCustomers(pagedData);
        });
    };

    const onPage = (event: DataTablePageEvent) => {
        setFirst(event.first);
        setRows(event.rows);
        loadCustomers(event.first, event.rows);
    };

    const formatDate = (value: string | Date) =>
        new Date(value).toLocaleDateString('en-US');

    const formatCurrency = (value: number) =>
        value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    const header = (
        <div className="flex justify-content-between">
            <h4 className="m-0">Customers</h4>
        </div>
    );

    return (
        <div className="card">
            <DataTable
                value={customers}
                lazy
                paginator
                first={first}
                rows={rows}
                totalRecords={totalRecords}
                onPage={onPage}
                header={header}
                rowsPerPageOptions={[12, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                emptyMessage="No customers found."
                dataKey="id"
            >
                <Column field="name" header="Name" sortable />
                <Column field="country.name" header="Country" sortable />
                <Column
                    field="date"
                    header="Date"
                    body={(rowData: Customer) => formatDate(rowData.date)}
                    sortable
                />
                <Column
                    field="balance"
                    header="Balance"
                    body={(rowData: Customer) => formatCurrency(rowData.balance)}
                    sortable
                />
                <Column
                    field="activity"
                    header="Activity"
                    body={(rowData: Customer) => (
                        <ProgressBar value={rowData.activity} showValue={false} style={{ height: '6px' }} />
                    )}
                />
                <Column
                    header="Action"
                    body={() => <Button icon="pi pi-cog" rounded />}
                />
            </DataTable>
        </div>
    );
}