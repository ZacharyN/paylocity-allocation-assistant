// Simple static server for testing the UI
const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 3002;

// Simple HTML template with our Vue components
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cost Center Setup - Test</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://unpkg.com/joi@17.13.3/dist/joi-browser.min.js"></script>
    <style>
        /* Basic styling */
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f9fafb;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .card { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .form-field { margin-bottom: 16px; }
        .form-field label { display: block; margin-bottom: 4px; font-weight: 500; }
        .form-field input { 
            width: 100%; 
            padding: 8px 12px; 
            border: 1px solid #d1d5db; 
            border-radius: 6px; 
        }
        .btn { 
            padding: 8px 16px; 
            border: none; 
            border-radius: 6px; 
            cursor: pointer; 
            font-weight: 500;
        }
        .btn-primary { background: #3b82f6; color: white; }
        .btn-outline { background: white; border: 1px solid #d1d5db; }
        .success { color: #10b981; }
        .error { color: #ef4444; }
        .warning { color: #f59e0b; }
        .progress-bar { 
            height: 8px; 
            background: #e5e7eb; 
            border-radius: 4px; 
            overflow: hidden; 
        }
        .progress-fill { 
            height: 100%; 
            background: #10b981; 
            transition: width 0.3s;
        }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; font-weight: 500; }
        .editable { cursor: pointer; padding: 4px; border-radius: 4px; }
        .editable:hover { background: #f3f4f6; }
    </style>
</head>
<body>
    <div id="app">
        <div class="container">
            <h1>Cost Center Setup - UI Demo</h1>
            <p>This is a demonstration of the cost center management interface.</p>
            
            <!-- Form Card -->
            <div class="card">
                <h2>Add New Cost Center</h2>
                <div class="form-grid" style="margin-bottom: 20px;">
                    <div class="form-field">
                        <label>Division</label>
                        <input type="number" v-model="form.division" placeholder="e.g. 123" min="0" max="999">
                        <small>3-digit division code</small>
                    </div>
                    <div class="form-field">
                        <label>Funding</label>
                        <input type="number" v-model="form.funding" placeholder="e.g. 456" min="0" max="999">
                        <small>3-digit funding code</small>
                    </div>
                    <div class="form-field">
                        <label>Program</label>
                        <input type="number" v-model="form.program" placeholder="e.g. 789" min="0" max="999">
                        <small>3-digit program code</small>
                    </div>
                </div>
                <div class="form-field" style="margin-bottom: 20px;">
                    <label>Allocation Percentage</label>
                    <input type="number" v-model="form.percentage" placeholder="0" min="0" :max="remainingPercentage" step="0.01">
                    <small>{{ percentageHelp }}</small>
                    
                    <!-- Real-time feedback -->
                    <div v-if="form.percentage && projectedTotal > 0" 
                         style="margin-top: 8px; padding: 12px; border-radius: 6px;"
                         :class="projectedTotal === 100 ? 'success' : projectedTotal > 100 ? 'error' : 'warning'"
                         :style="{ backgroundColor: projectedTotal === 100 ? '#ecfdf5' : projectedTotal > 100 ? '#fef2f2' : '#fffbeb' }">
                        Current total: {{ currentTotal.toFixed(1) }}% + {{ form.percentage }}% = {{ projectedTotal.toFixed(1) }}%
                        <div style="margin-top: 4px; font-size: 12px;">
                            <span v-if="projectedTotal > 100">This would exceed 100% by {{ (projectedTotal - 100).toFixed(1) }}%</span>
                            <span v-else-if="projectedTotal < 100">{{ (100 - projectedTotal).toFixed(1) }}% remaining after this addition</span>
                            <span v-else>Perfect! This will complete your allocation.</span>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; align-items: center; gap: 12px;">
                    <button class="btn btn-primary" @click="addCostCenter" :disabled="!canAdd">
                        Add Cost Center
                    </button>
                    <button class="btn btn-outline" @click="clearForm">
                        Clear
                    </button>
                    <div v-if="form.division && form.funding && form.program" 
                         style="margin-left: auto; padding: 4px 8px; background: #f3f4f6; border-radius: 4px;">
                        {{ formatCode(form.division) }}-{{ formatCode(form.funding) }}-{{ formatCode(form.program) }}
                    </div>
                </div>
            </div>
            
            <!-- List Card -->
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h2>Current Cost Centers</h2>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div>Total Allocation: 
                            <span :class="totalPercentage === 100 ? 'success' : totalPercentage > 100 ? 'error' : 'warning'">
                                {{ totalPercentage.toFixed(1) }}%
                            </span>
                        </div>
                        <div v-if="totalPercentage === 100" 
                             style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                            ✓ Complete
                        </div>
                        <div v-else-if="totalPercentage > 100" 
                             style="background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                            ⚠ Over 100%
                        </div>
                        <div v-else 
                             style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                            {{ (100 - totalPercentage).toFixed(1) }}% remaining
                        </div>
                    </div>
                </div>
                
                <div v-if="costCenters.length === 0" style="text-align: center; padding: 40px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">➕</div>
                    <h3>No cost centers configured yet</h3>
                    <p>Add your first cost center above to get started</p>
                </div>
                
                <table v-else>
                    <thead>
                        <tr>
                            <th>Cost Center</th>
                            <th>Division</th>
                            <th>Funding</th>
                            <th>Program</th>
                            <th>Percentage</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(cc, index) in costCenters" :key="index">
                            <td>
                                <code>{{ formatCode(cc.division) }}-{{ formatCode(cc.funding) }}-{{ formatCode(cc.program) }}</code>
                            </td>
                            <td>{{ formatCode(cc.division) }}</td>
                            <td>{{ formatCode(cc.funding) }}</td>
                            <td>{{ formatCode(cc.program) }}</td>
                            <td>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <div v-if="editingIndex === index" style="display: flex; align-items: center; gap: 4px;">
                                        <input type="number" v-model="editingValue" style="width: 60px;" min="0" max="100" step="0.01">
                                        <span>%</span>
                                        <button @click="saveEdit(index)" style="background: #10b981; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer;">✓</button>
                                        <button @click="cancelEdit" style="background: #ef4444; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer;">✗</button>
                                    </div>
                                    <div v-else style="display: flex; align-items: center; gap: 8px; width: 100%;">
                                        <span class="editable" @click="startEdit(index, cc.percentage)">{{ cc.percentage }}%</span>
                                        <div class="progress-bar" style="flex: 1; max-width: 100px;">
                                            <div class="progress-fill" :style="{ width: Math.min(cc.percentage, 100) + '%', backgroundColor: cc.percentage > 100 ? '#ef4444' : '#10b981' }"></div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <button @click="deleteCostCenter(index)" 
                                        style="background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <div v-if="costCenters.length > 0 && totalPercentage !== 100" 
                     style="margin-top: 16px; padding: 12px; border-radius: 6px; border: 1px solid;"
                     :style="{ 
                         borderColor: totalPercentage > 100 ? '#fecaca' : '#fed7aa',
                         backgroundColor: totalPercentage > 100 ? '#fef2f2' : '#fff7ed',
                         color: totalPercentage > 100 ? '#991b1b' : '#92400e'
                     }">
                    <div v-if="totalPercentage > 100" style="display: flex; align-items: center; gap: 8px;">
                        <span>⚠️</span>
                        <span>Total allocation exceeds 100%</span>
                    </div>
                    <div v-else style="display: flex; align-items: center; gap: 8px;">
                        <span>ℹ️</span>
                        <span>Total allocation must equal 100% to proceed</span>
                    </div>
                </div>
            </div>
            
            <!-- Navigation -->
            <div style="display: flex; justify-content: space-between;">
                <button class="btn btn-outline">← Back to Home</button>
                <button class="btn" 
                        :class="canProceed ? 'btn-primary' : 'btn-outline'" 
                        :disabled="!canProceed"
                        :title="canProceed ? 'Continue to Pay Periods' : 'Total allocation must equal 100% to proceed'">
                    Continue to Pay Periods →
                </button>
            </div>
        </div>
    </div>

    <script>
        const { createApp } = Vue;

        createApp({
            data() {
                return {
                    form: {
                        division: null,
                        funding: null,
                        program: null,
                        percentage: null
                    },
                    costCenters: [
                        { division: 123, funding: 456, program: 789, percentage: 60 },
                        { division: 123, funding: 456, program: 790, percentage: 30 }
                    ],
                    editingIndex: -1,
                    editingValue: 0
                };
            },
            computed: {
                totalPercentage() {
                    return this.costCenters.reduce((total, cc) => total + cc.percentage, 0);
                },
                currentTotal() {
                    return this.totalPercentage;
                },
                projectedTotal() {
                    return this.currentTotal + (this.form.percentage || 0);
                },
                remainingPercentage() {
                    return Math.max(0, 100 - this.currentTotal);
                },
                percentageHelp() {
                    if (this.currentTotal === 0) {
                        return "Percentage of time allocated to this cost center";
                    }
                    const remaining = 100 - this.currentTotal;
                    if (remaining <= 0) {
                        return "All allocation has been used. Edit existing cost centers to add more.";
                    }
                    return \`\${remaining.toFixed(1)}% remaining available for allocation\`;
                },
                canAdd() {
                    return this.form.division && this.form.funding && this.form.program && 
                           this.form.percentage && this.form.percentage > 0 && this.projectedTotal <= 100;
                },
                canProceed() {
                    return this.totalPercentage === 100;
                }
            },
            methods: {
                formatCode(num) {
                    return String(num).padStart(3, '0');
                },
                addCostCenter() {
                    if (this.canAdd) {
                        this.costCenters.push({
                            division: this.form.division,
                            funding: this.form.funding,
                            program: this.form.program,
                            percentage: this.form.percentage
                        });
                        this.clearForm();
                    }
                },
                clearForm() {
                    this.form = {
                        division: null,
                        funding: null,
                        program: null,
                        percentage: null
                    };
                },
                startEdit(index, value) {
                    this.editingIndex = index;
                    this.editingValue = value;
                },
                saveEdit(index) {
                    if (this.editingValue >= 0 && this.editingValue <= 100) {
                        this.costCenters[index].percentage = parseFloat(this.editingValue);
                        this.cancelEdit();
                    }
                },
                cancelEdit() {
                    this.editingIndex = -1;
                    this.editingValue = 0;
                },
                deleteCostCenter(index) {
                    if (confirm('Are you sure you want to delete this cost center?')) {
                        this.costCenters.splice(index, 1);
                    }
                }
            }
        }).mount('#app');
    </script>
</body>
</html>
`;

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(htmlTemplate);
});

server.listen(PORT, () => {
    console.log(`Test server running at http://localhost:${PORT}`);
    console.log('This is a demonstration of the cost center UI functionality.');
});