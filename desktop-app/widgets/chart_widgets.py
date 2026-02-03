"""
Chart Widgets using Matplotlib for PyQt5
"""
from PyQt5.QtWidgets import QWidget, QVBoxLayout
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import matplotlib.pyplot as plt


class ChartWidget(QWidget):
    """Base chart widget with Matplotlib"""
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setMinimumHeight(450)
        self.figure = Figure(figsize=(8, 6), facecolor='#1a202c')
        self.canvas = FigureCanvas(self.figure)
        
        layout = QVBoxLayout()
        layout.addWidget(self.canvas)
        self.setLayout(layout)
        
        # Set dark theme
        plt.style.use('dark_background')
    
    def clear(self):
        """Clear the figure"""
        self.figure.clear()
        self.canvas.draw()


class PieChartWidget(ChartWidget):
    """Pie chart for equipment type distribution"""
    
    def plot(self, distribution: dict):
        """Plot pie chart"""
        self.figure.clear()
        ax = self.figure.add_subplot(111)
        
        labels = list(distribution.keys())
        sizes = list(distribution.values())
        colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444']
        
        ax.pie(sizes, labels=labels, colors=colors[:len(labels)], autopct='%1.1f%%',
               startangle=90, textprops={'color': 'white', 'fontsize': 10})
        ax.set_title('Equipment Type Distribution', color='white', fontsize=14, pad=20)
        
        self.canvas.draw()


class BarChartWidget(ChartWidget):
    """Bar chart for flowrate and pressure comparison"""
    
    def plot(self, equipment_data: list):
        """Plot bar chart"""
        self.figure.clear()
        ax = self.figure.add_subplot(111)
        
        # Group by equipment type
        types = {}
        for eq in equipment_data:
            eq_type = eq['equipment_type']
            if eq_type not in types:
                types[eq_type] = {'flowrate': [], 'pressure': []}
            types[eq_type]['flowrate'].append(eq['flowrate'])
            types[eq_type]['pressure'].append(eq['pressure'])
        
        # Calculate averages
        labels = list(types.keys())
        flowrates = [sum(types[t]['flowrate']) / len(types[t]['flowrate']) for t in labels]
        pressures = [sum(types[t]['pressure']) / len(types[t]['pressure']) for t in labels]
        
        x = range(len(labels))
        width = 0.35
        
        bars1 = ax.bar([i - width/2 for i in x], flowrates, width, label='Avg Flowrate',
                       color='#3b82f6', edgecolor='#60a5fa', linewidth=1.5)
        bars2 = ax.bar([i + width/2 for i in x], pressures, width, label='Avg Pressure',
                       color='#8b5cf6', edgecolor='#a78bfa', linewidth=1.5)
        
        ax.set_xlabel('Equipment Type', color='white', fontsize=11)
        ax.set_ylabel('Value', color='white', fontsize=11)
        ax.set_title('Average Flowrate & Pressure by Type', color='white', fontsize=14, pad=20)
        ax.set_xticks(x)
        ax.set_xticklabels(labels, rotation=45, ha='right', color='white', fontsize=9)
        ax.tick_params(axis='y', labelcolor='white', labelsize=9)
        ax.legend(facecolor='#2d3748', edgecolor='#4a5568', labelcolor='white')
        ax.grid(True, alpha=0.2, linestyle='--')
        
        self.figure.tight_layout()
        self.canvas.draw()


class LineChartWidget(ChartWidget):
    """Line chart for temperature trend"""
    
    def plot(self, equipment_data: list):
        """Plot line chart"""
        self.figure.clear()
        ax = self.figure.add_subplot(111)
        
        temperatures = [eq['temperature'] for eq in equipment_data]
        x = list(range(1, len(temperatures) + 1))
        
        ax.plot(x, temperatures, color='#ec4899', linewidth=2.5, 
                marker='o', markersize=5, markerfacecolor='#ec4899',
                markeredgecolor='white', markeredgewidth=1.5)
        ax.fill_between(x, temperatures, alpha=0.2, color='#ec4899')
        
        ax.set_xlabel('Equipment Index', color='white', fontsize=11)
        ax.set_ylabel('Temperature', color='white', fontsize=11)
        ax.set_title('Temperature Trend Across Equipment', color='white', fontsize=14, pad=20)
        ax.tick_params(axis='both', labelcolor='white', labelsize=9)
        ax.grid(True, alpha=0.2, linestyle='--')
        
        self.figure.tight_layout()
        self.canvas.draw()
