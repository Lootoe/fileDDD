import * as math3D from './math3D.js'

class Point {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }
    equalTo(other) {
        return this.x === other.x && this.y === other.y && this.z === other.z
    }
    distanceTo(point) {
        return Math.sqrt(
            (this.x - point.x) ** 2 + (this.y - point.y) ** 2 + (this.z - point.z) ** 2
        )
    }
    toArray() {
        return [this.x, this.y, this.z]
    }
}

class Face {
    constructor(points) {
        this.points = points
    }
    includes(point) {
        return this.points.includes(point)
    }
}

class Tetrahedron {
    constructor(p1, p2, p3, p4) {
        this.vertices = [p1, p2, p3, p4]
        this.faces = [
            new Face([p1, p2, p3]),
            new Face([p1, p2, p4]),
            new Face([p1, p3, p4]),
            new Face([p2, p3, p4]),
        ]
        this.circumsphere = math3D.calculateCircumsphere(p1, p2, p3, p4)
    }
    includePoint(point) {
        return this.vertices.some(vertex => vertex.equalTo(point))
    }
    incircumsphere(point) {
        const distanceSquared = point.distanceTo(this.circumsphere.center) ** 2
        return distanceSquared <= (this.circumsphere.radius ** 2) + 1e-10 // 加上一个很小的误差范围
    }
}

class SuperTetrahedron extends Tetrahedron {
    // 生成超级四面体的算法有待优化，它对不是特别离散的点有效，对于离散过头的点无效
    constructor(points) {
        let minX = points[0].x, minY = points[0].y, minZ = points[0].z
        let maxX = points[0].x, maxY = points[0].y, maxZ = points[0].z

        // 找到点集的边界
        for (let p of points) {
            minX = Math.min(minX, p.x)
            minY = Math.min(minY, p.y)
            minZ = Math.min(minZ, p.z)
            maxX = Math.max(maxX, p.x)
            maxY = Math.max(maxY, p.y)
            maxY = Math.max(maxY, p.z)
        }

        const dx = maxX - minX
        const dy = maxY - minY
        const dz = maxZ - minZ
        const deltaMax = Math.max(dx, dy, dz) * 2

        const p1 = new Point(minX - 1, minY - 1, minZ - 1)
        const p2 = new Point(minX - 1, minY - 1, maxZ + deltaMax)
        const p3 = new Point(minX - 1, maxY + deltaMax, minZ - 1)
        const p4 = new Point(maxX + deltaMax, minY - 1, minZ - 1)

        super(p1, p2, p3, p4)
    }

    containsPoint(point) {
        const [A, B, C, D] = this.points

        const totalVolume = math3D.volume(A, B, C, D)
        const v1 = math3D.volume(point, B, C, D)
        const v2 = math3D.volume(A, point, C, D)
        const v3 = math3D.volume(A, B, point, D)
        const v4 = math3D.volume(A, B, C, point)

        return Math.abs(totalVolume - (v1 + v2 + v3 + v4)) < 1e-6
    }
}

const points = [
    new Point(2, 3, 4),
    new Point(5, 4, 2),
    new Point(9, 6, 7),
    new Point(4, 7, 9),
    new Point(8, 1, 5),
    new Point(7, 2, 6)
];